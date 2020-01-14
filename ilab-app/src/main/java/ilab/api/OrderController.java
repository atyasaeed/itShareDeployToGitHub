package ilab.api;

import java.util.List;
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
	@PostMapping(path = "cart", consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	
	public List<LineItem> postCartItem(@RequestBody LineItem	lineItem,Authentication authentication)
	{
		return orderService.addItemToCart(lineItem,authentication);
	}
	@DeleteMapping(path = "cart/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCartItem(@PathVariable("id") UUID id,Authentication authentication)
	{
		orderService.deleteCartItem(id,authentication);
	}

	@GetMapping(path = "cart")
	@Secured("ROLE_USER")
	public List<LineItem> getShoppingCart(Authentication authentication)
	{
		return orderService.getShoppingCart(authentication).getLineItems();
	}
	@PutMapping(path="cart/{id}")
	public LineItem updateCartItem(@RequestBody LineItem item,@PathVariable("id") UUID id,Authentication auth)
	{
		return orderService.updateItem(id, item, auth);
	}
}
