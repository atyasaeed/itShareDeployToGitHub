package ilab.api;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.domain.User;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = "/api/orders",produces = "application/json")

public class OrderController
{
	@Autowired
	private OrderService orderService;
	@GetMapping()
	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		return orderService.getOrders(auth);
	}
	
	@PutMapping(path="/{id}/approve")
	public OrderEntity approve(@PathVariable("id") UUID id,Authentication auth)
	{
		return orderService.approve(id,auth);
	}
	@PutMapping(path="/{id}/cancel")
	public OrderEntity cancel(@PathVariable("id") UUID id,Authentication auth)
	{
		return orderService.cancel(id,auth);
	}
	@PutMapping(path="/{id}/reject")
	public OrderEntity reject(@PathVariable("id") UUID id,Authentication auth)
	{
		return orderService.reject(id,auth);
	}
	
	@PostMapping(path = "cart", consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Iterable<LineItem> postCartItem(@RequestBody LineItem	lineItem,Authentication authentication)
	{
		Iterable<LineItem> items= orderService.addItemToCart(lineItem,authentication);
		return items;
	}
	
	@DeleteMapping(path = "cart/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCartItem(@PathVariable("id") UUID id,Authentication authentication)
	{
		orderService.deleteCartItem(id,authentication);
	}

	@GetMapping(path = "cart")
	@Secured("ROLE_USER")
	public Iterable<LineItem> getShoppingCart(Authentication authentication)
	{
		return orderService.getShoppingCart(authentication).getLineItems();
	}
	
	@PutMapping(path="cart/{id}")
	public LineItem updateCartItem(@RequestBody LineItem item,@PathVariable("id") UUID id,Authentication auth)
	{
		return orderService.updateItem(id, item, auth);
	}
	@PutMapping(path="checkout")
	public OrderEntity checkoutCart(Authentication auth)
	{
		return orderService.checkout(auth);
	}
}
