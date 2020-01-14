package ilab.core.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderType;
import ilab.core.repository.OrderRepository;

@Service
@Transactional
public class OrderService
{
	@Autowired
	private OrderRepository orderRepo;
	
	public OrderEntity addItemToCart(LineItem item)
	{
		return null;
	}
	public OrderEntity getShoppingCart()
	{
		List<OrderEntity> orders= orderRepo.findByType(OrderType.SHOPPING_CART,PageRequest.of(0, 1));
		OrderEntity order=null;
		if(!orders.isEmpty()) {
			order=orders.get(0);
		}
		
		return order;
	}
	
}
