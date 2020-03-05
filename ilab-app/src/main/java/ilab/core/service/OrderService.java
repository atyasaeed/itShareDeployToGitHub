package ilab.core.service;

import java.io.File;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

@Service
@Transactional
public class OrderService
{
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
	public Page<OrderEntity> getOrders(Pageable page,Specification<OrderEntity> specs)
	{
//		return orderRepo.findByStatus(OrderStatus.PENDING, specs, page);
		return orderRepo.findByStatus(OrderStatus.PENDING, page);
//		return orderRepo.findAll( specs,page).filter(order->order.getStatus()==OrderStatus.PENDING);
		
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
			File destPath=new File("D:\\workspaces\\ilab\\resources\\files\\"+order.getAccount().getId()+"\\"+digitalAsset.getId());
			System.out.println(destPath.getParentFile().getAbsolutePath());
			if(! destPath.getParentFile().exists())
				Files.createDirectory(destPath.getParentFile().toPath());
			file.transferTo(destPath);
			HyperFile hyperFile=item.getFiles().get(index);
			hyperFile.setAsset(digitalAsset);
			index++;
		}
		
		estomatorService.price(item);		

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
	public LineItem updateItem(UUID id,LineItem newItem, Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		LineItem item= lineItemRepo.findOneByIdAndOrderEntity_Account_Id(id, user.getAccounts().iterator().next().getId());
		if(item!=null)
			item.setQuantity(newItem.getQuantity());
			
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
	

}
