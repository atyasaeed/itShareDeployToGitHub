package ilab.core.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.FileAsset;
import ilab.core.domain.HyperFile;
import ilab.core.domain.ReasonStatus;
import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.LineItemStatus;
import ilab.core.domain.order.OrderAddress;
import ilab.core.domain.order.OrderEntity;
import ilab.core.domain.order.OrderStatus;
import ilab.core.domain.user.Address;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.User;
import ilab.core.repository.AddressRepository;
import ilab.core.repository.FileAssetRepository;
import ilab.core.repository.LineItemRepository;
import ilab.core.repository.OrderRepository;
import ilab.core.repository.UserRepository;
import ilab.utils.exception.IllegalRequestDataException;
import ilab.utils.exception.NotFoundException;

@Service
@Transactional
public class OrderService
{
	@Value("${iLab.queues.orderRejection}")
	private String orderRejectionQueue;
	@Value("${iLab.queues.orderQuoted}")
	private String orderQuotedQueue;
	@Value("${iLab.queues.orderInprogress}")
	private String orderInprogressQueue;
	@Value("${iLab.queues.orderExpired}")
	private String orderExpiredQueue;
	@Value("${iLab.queues.orderFinished}")
	private String orderFinishedQueue;
	@Value("${iLab.queues.orderDelivered}")
	private String orderDeliveredQueue;
	@Value("${iLab.paths.files}")
	String filesPath;
	@Autowired
	private OrderRepository orderRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private LineItemRepository lineItemRepo;
	@Autowired
	private FileAssetRepository assetsRepo;
	@Autowired
	private JmsTemplate jmsTemplate;
	@Autowired
	private EmailService emailService;

	@Autowired
	private AddressRepository addressRepo;

	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		return orderRepo.findByOrganization(OrderStatus.SHOPPING_CART, user.getDefaultOrg().getId(),
				PageRequest.of(0, 100));
	}

	public OrderEntity getOrder(UUID orderId)
	{
		return orderRepo.findById(orderId).orElse(null);
	}

	public Page<OrderEntity> getOrders(Pageable page, Specification<OrderEntity> specs, Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		return orderRepo.findAll(filterByOrgId(user.getDefaultOrg().getId()).and(specs), page);

	}

	public Page<OrderEntity> getOrders(Pageable page, Specification<OrderEntity> specs)
	{
		return orderRepo.findAll(filterByOrderStatus(OrderStatus.SHOPPING_CART).and(specs), page);

	}

	public Specification<OrderEntity> filterByOrgId(UUID orgId)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			Path<Organization> organizationPath = root.<Organization>get("organization");
			predicates.add(cb.equal(organizationPath.<UUID>get("id"), orgId));
			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), OrderStatus.SHOPPING_CART));
			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), OrderStatus.GALLERY_CART));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}

	public Specification<OrderEntity> filterByOrderStatus(OrderStatus status)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), status));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}

	public OrderEntity acceptQuote(UUID orderId, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.QUOTED, LineItemStatus.QUOTE_ACCEPTED,
				LineItemStatus.QUOTE_REJECTED, LineItemStatus.CANCELLED, LineItemStatus.ITEM_REJECTED);
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getOrganization().getId().equals(user.getDefaultOrg().getId())
				&& order.getStatus() == OrderStatus.QUOTED)
		{
			order.setStatus(OrderStatus.QUOTE_ACCEPTED);
			for (LineItem item : order.getLineItems())
			{
				if (!eligibleStatus.contains(item.getStatus()))
					throw new IllegalRequestDataException("Items are not in suitable status");
				if (item.getStatus().equals(LineItemStatus.QUOTED))
				{
					item.setStatus(LineItemStatus.QUOTE_ACCEPTED);
					item.setEstimatedStartDate(LocalDateTime.now().plusDays(1));
				}
			}
		}

		return order;
	}

	public OrderEntity rejectQuote(UUID orderId, Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getOrganization().getId().equals(user.getDefaultOrg().getId())
				&& order.getStatus() == OrderStatus.QUOTED)
		{
			order.setStatus(OrderStatus.QUOTE_REJECTED);

		}
		return order;
	}

	public OrderEntity cancelOrder(UUID orderId, Authentication auth)
	{
		List<OrderStatus> eligibleStatus = Arrays.asList(OrderStatus.QUOTED, OrderStatus.WAIT_QUOTE,
				OrderStatus.PENDING, OrderStatus.QUOTE_ACCEPTED);
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getOrganization().getId().equals(user.getDefaultOrg().getId())
				&& eligibleStatus.contains(order.getStatus()))
		{
			order.setStatus(OrderStatus.CANCELLED);
		}
		return order;
	}

	public LineItem addItemToCart(LineItem item, MultipartFile files[], Authentication auth) throws Exception
	{
		OrderEntity order = getShoppingCart(auth);

		item.setOrderEntity(order);
		order.addLineItem(item);
		int index = 0;
		for (HyperFile hyperFile : item.getFiles())
		{
			// Todo: Validate the user owns the file asset if its ID!=null
			if (hyperFile.getAsset().getId() == null)
			{
				FileAsset digitalAsset = new FileAsset();
				digitalAsset.setName(files[index].getOriginalFilename());
				digitalAsset.setOrganization(order.getOrganization());
				digitalAsset = assetsRepo.save(digitalAsset);
				File destPath = new File(
						filesPath + order.getOrganization().getId() + File.separator + digitalAsset.getId());
				System.out.println(destPath.getParentFile().getAbsolutePath());
				if (!destPath.getParentFile().exists())
					Files.createDirectory(destPath.getParentFile().toPath());
				files[index].transferTo(destPath);
				hyperFile.setAsset(digitalAsset);
				index++;
			} else
			{
				FileAsset digitalAsset = assetsRepo.findById(hyperFile.getAsset().getId()).orElseThrow();
				if (!digitalAsset.getOrganization().getId().equals(order.getOrganization().getId()))
					throw new IllegalRequestDataException("The file is not belonging to the user");
				hyperFile.setAsset(assetsRepo.findById(hyperFile.getAsset().getId()).orElseThrow());
			}
		}

//		estomatorService.price(item);		
		item.setStatus(LineItemStatus.PENDING);
		item = lineItemRepo.save(item);
		order = orderRepo.save(order);

		// TODO: To be refactored

		return item;
	}

	public void deleteCartItem(UUID id, Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Organization_Id(id, user.getDefaultOrg().getId())
				.orElseThrow();

//		OrderEntity orderEntity = orderRepo.findById(item.getOrderEntity().getId()).orElseThrow();
		OrderEntity orderEntity = item.getOrderEntity();
		if (orderEntity.getStatus().equals(OrderStatus.SHOPPING_CART) && orderEntity.getLineItems().contains(item))
		{
			orderEntity.getLineItems().remove(item);
			orderRepo.save(orderEntity);
			lineItemRepo.delete(item);
		}

	}

	public OrderEntity getShoppingCart(UUID OrgId)
	{
		List<OrderEntity> orders = orderRepo.findShoppingCart(OrderStatus.SHOPPING_CART, OrgId, PageRequest.of(0, 1));
		OrderEntity order = null;
		if (!orders.isEmpty())
		{
			order = orders.get(0);
		}

		return order;
	}

	public Iterable<LineItem> getGalleryItems()
	{
		return null;
	}

	public OrderEntity getShoppingCart(Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		UUID orgId = user.getDefaultOrg().getId();
		OrderEntity order = getShoppingCart(orgId);
		if (order == null)
		{
			order = new OrderEntity();
			order.setStatus(OrderStatus.SHOPPING_CART);
			order.setPlacedBy(user);
			order.setOrganization(user.getDefaultOrg());
			order = orderRepo.save(order);
		}
		return order;
	}

	public OrderEntity getGalleryCart(Authentication auth)
	{
		List<OrderEntity> orders = orderRepo.findGalleryCart(OrderStatus.GALLERY_CART, PageRequest.of(0, 1));
		OrderEntity gallery = null;
		if (!orders.isEmpty())
		{
			gallery = orders.get(0);
		}

		if (gallery == null)
		{

			User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();

			gallery = new OrderEntity();
			gallery.setStatus(OrderStatus.GALLERY_CART);
			gallery.setPlacedBy(user);
			gallery.setOrganization(user.getDefaultOrg());
			gallery = orderRepo.save(gallery);
		}
		return gallery;
	}

	public LineItem updateItem(UUID id, LineItem newItem, Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Organization_Id(id, user.getDefaultOrg().getId())
				.orElseThrow();
		if (item != null)
		{
			item.setQuantity(newItem.getQuantity());
			item.setNotes(newItem.getNotes());
			// TODO: need support for multiple files
			if (item.getFiles().size() > 0 && newItem.getFiles().size() > 0)
			{
				HyperFile hf = item.getFiles().get(0);
				HyperFile newHf = newItem.getFiles().get(0);
				hf.setHeight(newHf.getHeight());
				hf.setWidth(newHf.getWidth());
				hf.setThickness(newHf.getThickness());
				hf.setType(newHf.getType());
				hf.setColor(newHf.getColor());
				hf.setMaterial(newHf.getMaterial());
				hf.setUnit(newHf.getUnit());
				hf.setProcesses((String) newHf.getProcesses());
			}
		}

		return item;
	}

	public LineItem updateItem(LineItem newItem)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.QUOTED, LineItemStatus.ITEM_REJECTED,
				LineItemStatus.PENDING);
		LineItem item = lineItemRepo.findById(newItem.getId()).orElseThrow();
		if (item.getOrderEntity().getStatus() == OrderStatus.PENDING && eligibleStatus.contains(item.getStatus()))
		{
			item.setDuration(newItem.getDuration());
			item.setUnitPrice(newItem.getUnitPrice());
		} else
			throw new IllegalRequestDataException("Can't modify the item data");

		return item;
	}

	public OrderEntity checkout(Authentication auth, UUID id)
	{
		OrderEntity order = getShoppingCart(auth);
		Address address = addressRepo.findByIdAndUser_username(id, auth.getName().toLowerCase()).orElseThrow();

		if (order.getLineItems().isEmpty())
			order = null;
		else
		{
			order.setStatus(OrderStatus.PENDING);
			order.setCreated(LocalDateTime.now());
			if (order.getShippingAddress() == null)
				order.setShippingAddress(new OrderAddress());
			BeanUtils.copyProperties(address, order.getShippingAddress());
		}
		return order;
	}

	public void convertCartToGallery(Authentication auth)
	{
		OrderEntity cart = getShoppingCart(auth);
		OrderEntity gallery = getGalleryCart(auth);
		for (LineItem item : cart.getLineItems())
		{

			item.setOrderEntity(gallery);
			gallery.addLineItem(item);

		}
		cart.getLineItems().clear();
	}

	public LineItem cloneGalleryItemToCart(UUID id, Authentication authentication) throws IOException
	{
		LineItem item = lineItemRepo.findById(id).orElseThrow(() -> new NotFoundException("Line item was not found"));
		if (item.getOrderEntity().getStatus() != OrderStatus.GALLERY_CART)
			throw new IllegalRequestDataException("This item is not a gallery item");
		OrderEntity cart = getShoppingCart(authentication);
		LineItem newItem = new LineItem();
		newItem.setOrderEntity(cart);
		cart.addLineItem(newItem);
		newItem.setNotes(item.getNotes());
		newItem.setQuantity(item.getQuantity());
		newItem.setService(item.getService());
		newItem.setUnitPrice(item.getUnitPrice());
		newItem.setStatus(LineItemStatus.PENDING);
		for (HyperFile hyperFile : item.getFiles())
		{
			FileAsset digitalAsset = new FileAsset();
			digitalAsset.setName(hyperFile.getAsset().getName());
			digitalAsset.setOrganization(cart.getOrganization());
			digitalAsset = assetsRepo.save(digitalAsset);
			File sourcePath = new File(filesPath + item.getOrderEntity().getOrganization().getId() + File.separator
					+ hyperFile.getAsset().getId());
			File destPath = new File(
					filesPath + cart.getOrganization().getId() + File.separator + digitalAsset.getId());
			if (!destPath.getParentFile().exists())
				Files.createDirectory(destPath.getParentFile().toPath());
			Files.copy(sourcePath.toPath(), destPath.toPath(), StandardCopyOption.REPLACE_EXISTING);
			HyperFile newHyperFile = new HyperFile();
			newHyperFile.setAsset(digitalAsset);

			newHyperFile.setMaterial(hyperFile.getMaterial());
			newHyperFile.setType(hyperFile.getType());
			newHyperFile.setColor(hyperFile.getColor());
			newHyperFile.setHeight(hyperFile.getHeight());
			newHyperFile.setWidth(hyperFile.getWidth());

			newHyperFile.setThickness(hyperFile.getThickness());
			newHyperFile.setUnit(hyperFile.getUnit());
			newHyperFile.setProcesses(hyperFile.getProcesses());

			newItem.getFiles().add(newHyperFile);

		}
		return newItem;
	}

	public OrderEntity quote(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.QUOTED, LineItemStatus.ITEM_REJECTED,
				LineItemStatus.CANCELLED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.PENDING
				&& order.getLineItems().stream().allMatch((item) -> eligibleStatus.contains(item.getStatus())))
		{

			order.setStatus(OrderStatus.QUOTED);
			order.setQuotedAt(LocalDateTime.now());
			order.setExpiredAt(order.getQuotedAt().plusDays(9));
			Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
			jmsTemplate.convertAndSend(orderQuotedQueue, dto);

		}
		return order;
	}

	public OrderEntity rejectOrder(UUID id, OrderEntity order, Authentication auth)
	{
		OrderEntity persistedOrder = orderRepo.findById(id).orElseThrow();
		if (persistedOrder.getStatus() == OrderStatus.PENDING)
		{
			persistedOrder.setStatus(OrderStatus.ORDER_REJECTED);
			if (order != null)
			{
				if (order.getRejectionReasons() == null || order.getRejectionReasons().size() == 0
						|| !order.getRejectionReasons().stream()
								.anyMatch((reason) -> reason.getStatus() != ReasonStatus.PUBLISHED))
					throw new IllegalRequestDataException("Some reasons are not active");
				persistedOrder.setRejectionNote(order.getRejectionNote());
				persistedOrder.setRejectionReasons(order.getRejectionReasons());
				Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
				jmsTemplate.convertAndSend(orderRejectionQueue, dto);
			}
		}

		return persistedOrder;
	}

	public OrderEntity processOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED, LineItemStatus.CANCELLED,
				LineItemStatus.QUOTE_REJECTED, LineItemStatus.QUOTE_ACCEPTED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.QUOTE_ACCEPTED && order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item) -> eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.IN_PROGRESS);
			Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
			jmsTemplate.convertAndSend(orderInprogressQueue, dto);
		} else
			throw new IllegalRequestDataException("Items are not in suitable status");
		return order;
	}

	public OrderEntity expireOrder(UUID id, Authentication auth)
	{
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.QUOTED)
		{
			order.setStatus(OrderStatus.QUOTE_EXPIRED);
			Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
			jmsTemplate.convertAndSend(orderExpiredQueue, dto);
		} else
			throw new IllegalRequestDataException("Order is not in Quoted status");
		return order;
	}

	public OrderEntity finishOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED, LineItemStatus.CANCELLED,
				LineItemStatus.QUOTE_REJECTED, LineItemStatus.FINISHED, LineItemStatus.DELIVERED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.IN_PROGRESS && order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item) -> eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.FINISHED);
			Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
			jmsTemplate.convertAndSend(orderFinishedQueue, dto);
		}
		return order;
	}

	public OrderEntity deliverOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED, LineItemStatus.CANCELLED,
				LineItemStatus.QUOTE_REJECTED, LineItemStatus.DELIVERED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.FINISHED && order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item) -> eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.DELIVERED);
			Map<String, String> dto = Map.of("AcctMgr", auth.getName(), "orderId", order.getId().toString());
			jmsTemplate.convertAndSend(orderDeliveredQueue, dto);
		}
		return order;
	}

	public LineItem cancelItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING, LineItemStatus.QUOTED,
				LineItemStatus.QUOTE_ACCEPTED, LineItemStatus.QUOTE_REJECTED, LineItemStatus.ITEM_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING, OrderStatus.QUOTED,
				OrderStatus.QUOTE_ACCEPTED);

		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Organization_Id(id, user.getDefaultOrg().getId())
				.orElseThrow();

		if (eligibleItemStatus.contains(item.getStatus())
				&& eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.CANCELLED);
		} else
			throw new IllegalRequestDataException("Can't cancel item");
		return item;
	}

	public LineItem rejectItemQuote(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTED, LineItemStatus.QUOTE_ACCEPTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.QUOTED);
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Organization_Id(id, user.getDefaultOrg().getId())
				.orElseThrow();

		if (eligibleItemStatus.contains(item.getStatus())
				&& eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.QUOTE_REJECTED);
		} else
			throw new IllegalRequestDataException("Can't reject item quote");
		return item;
	}

	public LineItem acceptItemQuote(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTED, LineItemStatus.QUOTE_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.QUOTED);
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Organization_Id(id, user.getDefaultOrg().getId())
				.orElseThrow();

		if (eligibleItemStatus.contains(item.getStatus())
				&& eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.QUOTE_ACCEPTED);
		} else
			throw new IllegalRequestDataException("Can't accept  item quote");
		return item;
	}

	public LineItem quoteItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING, LineItemStatus.QUOTED,
				LineItemStatus.ITEM_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING);
		LineItem item = lineItemRepo.findById(id).orElseThrow();
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus())
				&& eligibleItemStatus.contains(item.getStatus()) && item.getDuration() > 0
				&& item.getUnitPrice() != null)
		{
			item.setStatus(LineItemStatus.QUOTED);
		} else
			throw new IllegalRequestDataException("Can't quote  the item ");
		return item;
	}

	public LineItem rejectItem(UUID id, LineItem item, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING, LineItemStatus.QUOTED,
				LineItemStatus.ITEM_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING);
		LineItem existingItem = lineItemRepo.findById(id).orElseThrow();
		if (eligibleOrderStatus.contains(existingItem.getOrderEntity().getStatus())
				&& eligibleItemStatus.contains(existingItem.getStatus()))
		{
			existingItem.setStatus(LineItemStatus.ITEM_REJECTED);
			if (item != null)
			{
				if (item.getRejectionReasons() == null || item.getRejectionReasons().size() == 0
						|| !item.getRejectionReasons().stream()
								.anyMatch((reason) -> reason.getStatus() != ReasonStatus.PUBLISHED))
					throw new IllegalRequestDataException("Some reasons are not active");
				existingItem.setRejectionNote(item.getRejectionNote());
				existingItem.setRejectionReasons(item.getRejectionReasons());
			}
		} else
			throw new IllegalRequestDataException("Can't reject  the item ");
		return existingItem;
	}

	public LineItem processItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTE_ACCEPTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.IN_PROGRESS);
		LineItem item = lineItemRepo.findById(id).orElseThrow();
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus())
				&& eligibleItemStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.IN_PROGRESS);
		} else
			throw new IllegalRequestDataException("Can't process  the item ");
		return item;
	}

	public LineItem finishItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.IN_PROGRESS);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.IN_PROGRESS);
		LineItem item = lineItemRepo.findById(id).orElseThrow();

		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus())
				&& eligibleItemStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.FINISHED);
		} else
			throw new IllegalRequestDataException("Can't finish  the item ");
		return item;
	}

	public LineItem deliverItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.FINISHED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.FINISHED, OrderStatus.IN_PROGRESS);
		LineItem item = lineItemRepo.findById(id).orElseThrow();

		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus())
				&& eligibleStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.DELIVERED);
		} else
			throw new IllegalRequestDataException("Can't Deliver  the item ");
		return item;
	}

	public LineItem reset(UUID id)
	{
		LineItem item = lineItemRepo.findById(id).orElseThrow();
		if (item.getOrderEntity().getStatus() == OrderStatus.PENDING && item.getStatus() != LineItemStatus.CANCELLED)
		{
			item.setStatus(LineItemStatus.PENDING);
		} else
			throw new IllegalRequestDataException("Can't reset item");
		return item;
	}

	@Scheduled(fixedDelay = 1000 * 60 * 60) // Every hour to run
	public void orderScheduler()
	{

	}

	public void sendOrderRejectionMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.ORDER_REJECTED)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order %s has been rejected  ", order.getId()), "order-rejection-email.ftl",
					dto);

		}

	}

	public void sendOrderQuotedMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.QUOTED)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order %s has been quoted  ", order.getId()), "order-quoted-email.ftl", dto);

		}

	}

	public void sendOrderInprogressMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.IN_PROGRESS)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order %s is in progress  ", order.getId()), "order-inprogress-email.ftl", dto);

		}

	}

	public void sendOrderExpiredMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.QUOTE_EXPIRED)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order quote %s has been expired", order.getId()), "order-expired-email.ftl",
					dto);

		}

	}

	public void sendOrderFinishedMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.FINISHED)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order %s has been finished", order.getId()), "order-finished-email.ftl", dto);

		}

	}

	public void sendOrderDeliveredMsg(String email, UUID orderId) throws Exception
	{
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		User acctMgr = userRepo.findByUsernameIgnoreCase(email).orElseThrow();
		if (acctMgr != null && order.getStatus() == OrderStatus.FINISHED)
		{
			Map<String, String> dto = Map.of("user", order.getPlacedBy().getFirstName(), "acctMgr",
					acctMgr.getFirstName(), "orderId", order.getId().toString());
			emailService.sendTemplateMessage(order.getPlacedBy().getEmail(),
					String.format("Your Order %s has been delivered", order.getId()), "order-delivered-email.ftl", dto);

		}

	}

	public LineItem changeItemToRFM(UUID id, Authentication auth)
	{
		return changeStatus(id, LineItemStatus.PENDING, LineItemStatus.RFM);
	}

	public LineItem changeItemToHoldRFQ(UUID id)
	{
		return changeStatus(id, LineItemStatus.RFM, LineItemStatus.HRFQ);

	}

	public LineItem resumeRFM(UUID id)
	{

		return changeStatus(id, LineItemStatus.HRFQ, LineItemStatus.RFM);
	}

	public LineItem changeStatus(UUID id, LineItemStatus changeFrom, LineItemStatus changeTo)
	{
		LineItem item = lineItemRepo.findById(id).orElseThrow();

		if (item.getStatus().equals(changeFrom) && item.getOrderEntity().getStatus().equals(OrderStatus.PENDING))
		{
			item.setStatus(changeTo);
			item = lineItemRepo.save(item);
			return item;
		}
		return item;

	}
}
