package ilab.core.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderType;
import ilab.core.domain.User;
import ilab.core.repository.LineItemRepository;
import ilab.core.repository.OrderRepository;
import ilab.core.repository.UserRepository;

@Service
@Transactional(value = TxType.REQUIRED)
public class OrderService
{
	@Autowired
	private OrderRepository orderRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private LineItemRepository lineItemRepo;
	
	public Set<LineItem> addItemToCart(LineItem item,Authentication auth)
	{
		OrderEntity order=getShoppingCart(auth);
		
		item.setOrderEntity(order);
		order.addLineItem(item);
		order=orderRepo.save(order);
		return order.getLineItems();
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
		List<OrderEntity> orders= orderRepo.findShoppingCart(OrderType.SHOPPING_CART,accountId,PageRequest.of(0, 1));
		OrderEntity order=null;
		if(!orders.isEmpty()) {
			order=orders.get(0);
		}
		
		return order;
	}
	public OrderEntity getShoppingCart(Authentication auth)
	{
		User user=userRepo.findByUsername(auth.getName());
		OrderEntity order=getShoppingCart(user.getAccounts().iterator().next().getId());
		if(order==null) {
			order=new OrderEntity();
			order.setType(OrderType.SHOPPING_CART);
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
	
}
