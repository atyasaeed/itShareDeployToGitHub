package ilab.core.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.Account;
import ilab.core.domain.FileAsset;
import ilab.core.domain.HyperFile;
import ilab.core.domain.LineItem;
import ilab.core.domain.LineItemStatus;
import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderStatus;
import ilab.core.domain.User;
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

	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		User user = userRepo.findByUsername(auth.getName());
		return orderRepo.findByAccount(OrderStatus.SHOPPING_CART, user.getAccounts().iterator().next().getId(),
				PageRequest.of(0, 100));
	}

	public OrderEntity getOrder(UUID orderId)
	{
		return orderRepo.findById(orderId).orElse(null);
	}

	public Page<OrderEntity> getOrders(Pageable page, Specification<OrderEntity> specs, Authentication auth)
	{
		User user = userRepo.findByUsername(auth.getName());
		Account account = user.getAccounts().iterator().next();
		return orderRepo.findAll(filterByAccountId(account.getId()).and(specs), page);

//		return orderRepo.findByStatus(OrderStatus.PENDING, specs, page);
//		return orderRepo.findByStatus(OrderStatus.PENDING, page);
//		return orderRepo.findAll( specs,page).filter(order->order.getStatus()==OrderStatus.PENDING);

	}

	public Page<OrderEntity> getOrders(Pageable page, Specification<OrderEntity> specs)
	{
		return orderRepo.findAll(filterByOrderStatus(OrderStatus.SHOPPING_CART).and(specs), page);

	}

	public Specification<OrderEntity> filterByAccountId(UUID accountId)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();

			Path<Account> accountPath = root.<Account>get("account");
			predicates.add(cb.equal(accountPath.<UUID>get("id"), accountId));
			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), OrderStatus.SHOPPING_CART));
			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), OrderStatus.GALLERY_CART));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}

	public Specification<OrderEntity> filterByOrderStatus(OrderStatus status)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();

			predicates.add(cb.notEqual(root.<OrderStatus>get("status"), status));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}

	public OrderEntity acceptQuote(UUID orderId, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.QUOTED,
				LineItemStatus.QUOTE_ACCEPTED,LineItemStatus.QUOTE_REJECTED,LineItemStatus.CANCELLED,LineItemStatus.ITEM_REJECTED);
		User user = userRepo.findByUsername(auth.getName());
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getAccount().getId().equals(user.getAccounts().iterator().next().getId())
				&& order.getStatus() == OrderStatus.QUOTED)
		{
			order.setStatus(OrderStatus.QUOTE_ACCEPTED);
			for(LineItem item:order.getLineItems())
			{
				if(!eligibleStatus.contains(item.getStatus()))
					throw new IllegalRequestDataException("Items are not in suitable status");
				if(item.getStatus().equals(LineItemStatus.QUOTED))
					item.setStatus(LineItemStatus.QUOTE_ACCEPTED);
			}
		}

		return order;
	}

	public OrderEntity rejectQuote(UUID orderId, Authentication auth)
	{
		User user = userRepo.findByUsername(auth.getName());
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getAccount().getId().equals(user.getAccounts().iterator().next().getId())
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
		User user = userRepo.findByUsername(auth.getName());
		OrderEntity order = orderRepo.findById(orderId).orElseThrow();
		if (order.getAccount().getId().equals(user.getAccounts().iterator().next().getId())
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
		for(HyperFile hyperFile:item.getFiles())
		{
			//Todo: Validate the user owns the file asset if its ID!=null
			if(hyperFile.getAsset().getId()==null)
			{
				FileAsset digitalAsset = new FileAsset();
				digitalAsset.setName(files[index].getOriginalFilename());
				digitalAsset.setAccount(order.getAccount());
				digitalAsset = assetsRepo.save(digitalAsset);
				File destPath = new File(filesPath + order.getAccount().getId() + "\\" + digitalAsset.getId());
				System.out.println(destPath.getParentFile().getAbsolutePath());
				if (!destPath.getParentFile().exists())
					Files.createDirectory(destPath.getParentFile().toPath());
				files[index].transferTo(destPath);
				hyperFile.setAsset(digitalAsset);
				index++;
			}
			else
			{
				FileAsset digitalAsset=assetsRepo.findById(hyperFile.getAsset().getId()).orElseThrow();
				if(!digitalAsset.getAccount().getId().equals(order.getAccount().getId()))
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
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();

//		OrderEntity orderEntity = orderRepo.findById(item.getOrderEntity().getId()).orElseThrow();
		OrderEntity orderEntity = item.getOrderEntity();
		if (orderEntity.getStatus().equals(OrderStatus.SHOPPING_CART) && orderEntity.getLineItems().contains(item))
		{
			orderEntity.getLineItems().remove(item);
			orderRepo.save(orderEntity);
			lineItemRepo.delete(item);
		}

	}

	public OrderEntity getShoppingCart(UUID accountId)
	{
		List<OrderEntity> orders = orderRepo.findShoppingCart(OrderStatus.SHOPPING_CART, accountId,
				PageRequest.of(0, 1));
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
		User user = userRepo.findByUsername(auth.getName());
		UUID accountId = user.getAccounts().iterator().next().getId();
		OrderEntity order = getShoppingCart(accountId);
		if (order == null)
		{
			order = new OrderEntity();
			order.setStatus(OrderStatus.SHOPPING_CART);
			order.setPlacedBy(user);
			order.setAccount(user.getAccounts().iterator().next());
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

			User user = userRepo.findByUsername(auth.getName());
			UUID accountId = user.getAccounts().iterator().next().getId();

			gallery = new OrderEntity();
			gallery.setStatus(OrderStatus.GALLERY_CART);
			gallery.setPlacedBy(user);
			gallery.setAccount(user.getAccounts().iterator().next());
			gallery = orderRepo.save(gallery);
		}
		return gallery;
	}

	public LineItem updateItem(UUID id, LineItem newItem, Authentication auth)
	{
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
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
		LineItem item = lineItemRepo.findById(newItem.getId()).orElseThrow();
		if (item.getOrderEntity().getStatus() == OrderStatus.PENDING && item.getStatus()==LineItemStatus.PENDING)
		{
			item.setEstimatedEndDate(newItem.getEstimatedEndDate());
			item.setUnitPrice(newItem.getUnitPrice());
		}
		return item;
	}

	public OrderEntity checkout(Authentication auth)
	{
		OrderEntity order = getShoppingCart(auth);
		if (order.getLineItems().isEmpty())
			order = null;
		else
		{
			order.setStatus(OrderStatus.PENDING);
			order.setCreated(new Date());
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
			digitalAsset.setAccount(cart.getAccount());
			digitalAsset = assetsRepo.save(digitalAsset);
			File sourcePath = new File(
					filesPath + item.getOrderEntity().getAccount().getId() + "\\" + hyperFile.getAsset().getId());
			File destPath = new File(filesPath + cart.getAccount().getId() + "\\" + digitalAsset.getId());
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
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.QUOTED,LineItemStatus.ITEM_REJECTED,
				 LineItemStatus.CANCELLED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.PENDING && order.getLineItems().stream()
				.allMatch((item)->eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.QUOTED);
		}
		return order;
	}

	public OrderEntity rejectOrder(UUID id, Authentication auth)
	{
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.PENDING)
		{
			order.setStatus(OrderStatus.ORDER_REJECTED);
		}
		return order;
	}

	public OrderEntity processOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED,
				LineItemStatus.CANCELLED,LineItemStatus.QUOTE_REJECTED,LineItemStatus.QUOTE_ACCEPTED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.QUOTE_ACCEPTED&& order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item)->eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.IN_PROGRESS);
		}
		else 
			throw new IllegalRequestDataException("Items are not in suitable status");
		return order;
	}

	public OrderEntity finishOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED,
				LineItemStatus.CANCELLED,LineItemStatus.QUOTE_REJECTED,LineItemStatus.FINISHED,LineItemStatus.DELIVERED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.IN_PROGRESS&& order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item)->eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.FINISHED);
		}
		return order;
	}

	public OrderEntity deliverOrder(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.ITEM_REJECTED,
				LineItemStatus.CANCELLED,LineItemStatus.QUOTE_REJECTED,LineItemStatus.DELIVERED);
		OrderEntity order = orderRepo.findById(id).orElseThrow();
		if (order.getStatus() == OrderStatus.FINISHED&& order.getLineItems().stream()
//				.noneMatch((item) -> item.getUnitPrice() == null || item.getEstimatedEndDate() == null))
				.allMatch((item)->eligibleStatus.contains(item.getStatus())))
		{
			order.setStatus(OrderStatus.DELIVERED);
		}
		return order;
	}

	public LineItem cancelItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING,LineItemStatus.QUOTED,
				 LineItemStatus.QUOTE_ACCEPTED,LineItemStatus.QUOTE_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING,OrderStatus.QUOTED,
				OrderStatus.QUOTE_ACCEPTED);
		
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleItemStatus.contains(item.getStatus())&&eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.CANCELLED);
		}
		else
			throw new IllegalRequestDataException("Can't cancel item");
		return item;
	}

	public LineItem rejectItemQuote(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.QUOTED);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleItemStatus.contains(item.getStatus())&&eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.QUOTE_REJECTED);
		}
		else
			throw new IllegalRequestDataException("Can't reject item quote");
		return item;
	}

	public LineItem acceptItemQuote(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.QUOTED);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleItemStatus.contains(item.getStatus())&&eligibleOrderStatus.contains(item.getOrderEntity().getStatus()))
		{
			item.setStatus(LineItemStatus.QUOTE_ACCEPTED);
		}
		else
			throw new IllegalRequestDataException("Can't accept  item quote");
		return item;
	}

	public LineItem quoteItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING,LineItemStatus.QUOTED,LineItemStatus.ITEM_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus()) &&eligibleItemStatus.contains(item.getStatus())&&item.getEstimatedEndDate()!=null&&item.getUnitPrice()!=null)
		{
			item.setStatus(LineItemStatus.QUOTED);
		}
		else
			throw new IllegalRequestDataException("Can't quote  the item ");
		return item;
	}

	public LineItem rejectItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.PENDING,LineItemStatus.QUOTED,LineItemStatus.ITEM_REJECTED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.PENDING);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus()) && eligibleItemStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.ITEM_REJECTED);
		}
		else
			throw new IllegalRequestDataException("Can't reject  the item ");
		return item;
	}

	public LineItem processItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.QUOTE_ACCEPTED);
		List<OrderStatus> eligibleOrderStatus= Arrays.asList(OrderStatus.IN_PROGRESS);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus()) && eligibleItemStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.IN_PROGRESS);
		}
		else
			throw new IllegalRequestDataException("Can't process  the item ");
		return item;
	}
	public LineItem finishItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleItemStatus = Arrays.asList(LineItemStatus.IN_PROGRESS);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.IN_PROGRESS);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus()) && eligibleItemStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.FINISHED);
		}
		else
			throw new IllegalRequestDataException("Can't finish  the item ");
		return item;
	}
	public LineItem deliverItem(UUID id, Authentication auth)
	{
		List<LineItemStatus> eligibleStatus = Arrays.asList(LineItemStatus.FINISHED);
		List<OrderStatus> eligibleOrderStatus = Arrays.asList(OrderStatus.FINISHED,OrderStatus.IN_PROGRESS);
		User user = userRepo.findByUsername(auth.getName());
		LineItem item = lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id,
				user.getAccounts().iterator().next().getId()).orElseThrow();
			
		if (eligibleOrderStatus.contains(item.getOrderEntity().getStatus()) &&eligibleStatus.contains(item.getStatus()))
		{
			item.setStatus(LineItemStatus.DELIVERED);
		}
		else
			throw new IllegalRequestDataException("Can't Deliver  the item ");
		return item;
	}
}
