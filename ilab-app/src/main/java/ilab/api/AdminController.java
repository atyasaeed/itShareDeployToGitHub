package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.OrderEntity;
import ilab.core.domain.User;
import ilab.core.service.OrderService;
import ilab.core.service.UserService;

@RestController
@RequestMapping(path = "/api/admin", produces = "application/json")
@Secured("ROLE_ADMIN")
public class AdminController
{
	@Autowired
	UserService userService;
	@Autowired
	private OrderService orderService;
	@GetMapping("users/search")
	public Page<User> getUsersPageable(@PageableDefault(value = 10, sort =
	{ "username" }) Pageable page, @SearchSpec Specification<User> specs)
	{
		return userService.getUsers(page, specs);
	}
	@GetMapping("orders/search")
	public Page<OrderEntity> getOrdersPageable(@PageableDefault(value = 10, sort =
	{ "status" }) Pageable page, @SearchSpec Specification<OrderEntity> specs)
	{
		return orderService.getOrders(page, specs);
	}
	@GetMapping(path="orders/{id}")
	public OrderEntity getOrder(@PathVariable("id") UUID orderId)
	{
		return orderService.getOrder(orderId);
	}
}

