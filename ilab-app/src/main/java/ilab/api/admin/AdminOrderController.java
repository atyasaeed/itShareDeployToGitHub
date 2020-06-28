package ilab.api.admin;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = "/api/admin/orders", produces = "application/json")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminOrderController
{
	@Autowired
	private OrderService orderService;
	@GetMapping("search")
	public Page<OrderEntity> getOrdersPageable(@PageableDefault(value = 10, sort =
	{ "status" }) Pageable page, @SearchSpec Specification<OrderEntity> specs)
	{
		return orderService.getOrders(page, specs);
	}
	@GetMapping(path="{id}")
	public OrderEntity getOrder(@PathVariable("id") UUID orderId)
	{
		return orderService.getOrder(orderId);
	}
	@PutMapping(path = "lineItem")
	public LineItem updateCartItem(@RequestBody LineItem item, Authentication auth)
	{
		return orderService.updateItem( item);
	}
}

