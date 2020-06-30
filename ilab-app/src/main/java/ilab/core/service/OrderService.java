package ilab.core.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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
	@Autowired
	private EstimatorService estomatorService;
	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		return orderRepo.findByAccount(OrderStatus.SHOPPING_CART, user.getAccounts().iterator().next().getId(), PageRequest.of(0, 100));
	}
	public OrderEntity getOrder(UUID orderId)
	{
		return orderRepo.findById(orderId).orElse(null);
	}
	public Page<OrderEntity> getOrders(Pageable page,Specification<OrderEntity> specs,Authentication auth)
	{
		User user= userRepo.findByUsername(auth.getName());
		Account account=user.getAccounts().iterator().next();
		return orderRepo.findAll(filterByAccountId(account.getId()).and(specs),page);
		
//		return orderRepo.findByStatus(OrderStatus.PENDING, specs, page);
//		return orderRepo.findByStatus(OrderStatus.PENDING, page);
//		return orderRepo.findAll( specs,page).filter(order->order.getStatus()==OrderStatus.PENDING);
		
	} 
	public Page<OrderEntity> getOrders(Pageable page,Specification<OrderEntity> specs)
	{
		return orderRepo.findAll( filterByOrderStatus(OrderStatus.SHOPPING_CART).and(specs),page);
		
	}
	public Specification<OrderEntity> filterByAccountId(UUID accountId)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();

			Path<Account> accountPath = root.<Account>get("account");
			predicates.add(cb.equal(accountPath.<UUID>get("id"), accountId));
			predicates.add(cb.equal(root.<OrderStatus>get("status"), OrderStatus.PENDING));
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
	public OrderEntity approve(UUID orderId,Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		Optional<OrderEntity> result=orderRepo.findById(orderId);
		OrderEntity order=null;
		if(!result.isEmpty())
		{
			order=result.get();
			if(order.getAccount().getId().equals(user.getAccounts().iterator().next().getId()) && order.getStatus()==OrderStatus.WAIT_CONFIRMATION) {
					order.setStatus(OrderStatus.PENDING);
			}
			else
			{
				order=null;
			}
		}
		return order;
	}
	public OrderEntity reject(UUID orderId,Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		Optional<OrderEntity> result=orderRepo.findById(orderId);
		OrderEntity order=null;
		if(!result.isEmpty())
		{
			order=result.get();
			if(order.getAccount().getId().equals(user.getAccounts().iterator().next().getId()) && order.getStatus()==OrderStatus.WAIT_CONFIRMATION) {
					order.setStatus(OrderStatus.QUOTE_REJECTED);
			}
			else
			{
				order=null;
			}
		}
		return order;
	}
	
	public OrderEntity cancel(UUID orderId,Authentication auth)
	{
		List<OrderStatus> eligibleStatus=Arrays.asList(OrderStatus.WAIT_CONFIRMATION,OrderStatus.WAIT_QUOTE,OrderStatus.PENDING);
		User user=userRepo.findByUsername(auth.getName());
		Optional<OrderEntity> result=orderRepo.findById(orderId);
		OrderEntity order=null;
		if(!result.isEmpty())
		{
			order=result.get();
			if(order.getAccount().getId().equals(user.getAccounts().iterator().next().getId()) && 
					eligibleStatus.contains(order.getStatus())) {
					order.setStatus(OrderStatus.CANCELLED);
			}
			else
			{
				order=null;
			}
		}
		return order;
	}
	public LineItem addItemToCart(LineItem item,MultipartFile files[],Authentication auth) throws Exception
	{
		OrderEntity order=getShoppingCart(auth);
		
		item.setOrderEntity(order);
		order.addLineItem(item);
		int index=0;
		for (MultipartFile file : files)
		{
			FileAsset digitalAsset=new FileAsset();
			digitalAsset.setName(file.getOriginalFilename());
			digitalAsset.setAccount(order.getAccount());
			digitalAsset=assetsRepo.save(digitalAsset);
			File destPath=new File(filesPath+order.getAccount().getId()+"\\"+digitalAsset.getId());
			System.out.println(destPath.getParentFile().getAbsolutePath());
			if(! destPath.getParentFile().exists())
				Files.createDirectory(destPath.getParentFile().toPath());
			file.transferTo(destPath);
			HyperFile hyperFile=item.getFiles().get(index);
			hyperFile.setAsset(digitalAsset);
			index++;
		}
		
//		estomatorService.price(item);		

		item=lineItemRepo.save(item);
		order=orderRepo.save(order);
		
		
		//TODO: To be refactored

		
		
		return item;
	}
	public void deleteCartItem(UUID id,Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		LineItem item= lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id, user.getAccounts().iterator().next().getId());
		
		OrderEntity orderEntity=orderRepo.findById(item.getOrderEntity().getId()).get();
		if(orderEntity.getLineItems().contains(item))
		{
			orderEntity.getLineItems().remove(item);
			orderRepo.save(orderEntity);
			lineItemRepo.delete(item);
			
		}
//		if(item.getOrderEntity().getLineItems().contains(item)) {
//			item.getOrderEntity().getLineItems().remove(item);
//			lineItemRepo.deleteById(item.getId());
//		}
		
			
	}
	public OrderEntity getShoppingCart(UUID accountId)
	{
		List<OrderEntity> orders= orderRepo.findShoppingCart(OrderStatus.SHOPPING_CART,accountId,PageRequest.of(0, 1));
		OrderEntity order=null;
		if(!orders.isEmpty()) {
			order=orders.get(0);
		}
		
		return order;
	}
	public Iterable<LineItem> getGalleryItems()
	{
		return null;
	}
	public OrderEntity getShoppingCart(Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		UUID accountId=user.getAccounts().iterator().next().getId();
		OrderEntity order=getShoppingCart(accountId);
		if(order==null) {
			order=new OrderEntity();
			order.setStatus(OrderStatus.SHOPPING_CART);
			order.setPlacedBy(user);
			order.setAccount(user.getAccounts().iterator().next());
			order=orderRepo.save(order);
		}
		return order;
	}
	public OrderEntity getGalleryCart(Authentication auth)
	{
		List<OrderEntity> orders= orderRepo.findGalleryCart(OrderStatus.GALLERY_CART,PageRequest.of(0, 1));
		OrderEntity gallery=null;
		if(!orders.isEmpty()) {
			gallery=orders.get(0);
		}

		
		if(gallery==null) {

			User user=userRepo.findByUsername(auth.getName());
			UUID accountId=user.getAccounts().iterator().next().getId();
			
			gallery=new OrderEntity();
			gallery.setStatus(OrderStatus.GALLERY_CART);
			gallery.setPlacedBy(user);
			gallery.setAccount(user.getAccounts().iterator().next());
			gallery=orderRepo.save(gallery);
		}
		return gallery;
	}
	public LineItem updateItem(UUID id,LineItem newItem, Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		LineItem item= lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id, user.getAccounts().iterator().next().getId());
		if(item!=null)
			item.setQuantity(newItem.getQuantity());
			
		return item;
	}
	public LineItem updateItem(LineItem newItem)
	{
		LineItem item= lineItemRepo.findById(newItem.getId()).orElseThrow(()-> new NotFoundException("Line item was not found"));
		if(item!=null)
		{
			item.setEstimatedEndDate(newItem.getEstimatedEndDate());
			item.setUnitPrice(newItem.getUnitPrice());
		}
			
		return item;
	}
	public OrderEntity checkout(Authentication auth)
	{
		OrderEntity order=getShoppingCart(auth);
		if(order.getLineItems().isEmpty())
			order=null;
		else
			order.setStatus(OrderStatus.PENDING);
		return order;
	}
	public void convertCartToGallery(Authentication auth)
	{
		OrderEntity cart=getShoppingCart(auth);
		OrderEntity gallery=getGalleryCart(auth);
		for(LineItem item:cart.getLineItems())
		{
			
			item.setOrderEntity(gallery);
			gallery.addLineItem(item);
			
		}
		cart.getLineItems().clear();
	}
	public LineItem cloneGalleryItemToCart(UUID id, Authentication authentication) throws IOException
	{
		LineItem item= lineItemRepo.findById(id).orElseThrow(()-> new NotFoundException("Line item was not found"));
		if(item.getOrderEntity().getStatus()!=OrderStatus.GALLERY_CART)
			throw new IllegalRequestDataException("This item is not a gallery item");
		OrderEntity cart=getShoppingCart(authentication);
		LineItem newItem=new LineItem();
		newItem.setOrderEntity(cart);
		cart.addLineItem(newItem);
		newItem.setNotes(item.getNotes());
		newItem.setQuantity(item.getQuantity());
		newItem.setService(item.getService());
		newItem.setUnitPrice(item.getUnitPrice());
		for(HyperFile hyperFile:item.getFiles())
		{
			FileAsset digitalAsset=new FileAsset();
			digitalAsset.setName(hyperFile.getAsset().getName());
			digitalAsset.setAccount(cart.getAccount());
			digitalAsset=assetsRepo.save(digitalAsset);
			File sourcePath=new File(filesPath+item.getOrderEntity().getAccount().getId()+"\\"+hyperFile.getAsset().getId());
			File destPath=new File(filesPath+cart.getAccount().getId()+"\\"+digitalAsset.getId());
			if(! destPath.getParentFile().exists())
				Files.createDirectory(destPath.getParentFile().toPath());
			Files.copy(sourcePath.toPath(), destPath.toPath(),StandardCopyOption.REPLACE_EXISTING);
			HyperFile newHyperFile=new HyperFile();
			newHyperFile.setAsset(digitalAsset);
			newHyperFile.setColor(hyperFile.getColor());
			newHyperFile.setDimension(hyperFile.getDimension());
			newHyperFile.setMaterial(hyperFile.getMaterial());
			newHyperFile.setType(hyperFile.getType());
			newItem.getFiles().add(newHyperFile);
			
		}
		return newItem;
	}
}
