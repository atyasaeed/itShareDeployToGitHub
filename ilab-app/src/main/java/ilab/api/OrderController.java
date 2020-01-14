package ilab.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = "/api/orders",produces = "application/json")
public class OrderController
{
	@Autowired
	private OrderService orderService;
	@PostMapping(path = "cart", consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public OrderEntity postCartItem(@RequestBody LineItem	lineItem)
	{
		return orderService.addItemToCart(lineItem);
	}
	@GetMapping(path = "cart")
	@ResponseStatus(HttpStatus.CREATED)
	public OrderEntity getShoppingCart()
	{
		return orderService.getShoppingCart();
	}
	
}
