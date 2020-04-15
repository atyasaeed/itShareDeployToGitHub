package ilab.api;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.LineItem;
import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderStatus;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = OrderController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class OrderController
{
	static final String REST_URL = "/api/orders";
	@Autowired
	private OrderService orderService;

	@GetMapping()
	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		return orderService.getOrders(auth);
	}

	@PutMapping(path = "/{id}/approve")
	public OrderEntity approve(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.approve(id, auth);
	}

	@PutMapping(path = "/{id}/cancel")
	public OrderEntity cancel(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.cancel(id, auth);
	}

	@PutMapping(path = "/{id}/reject")
	public OrderEntity reject(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.reject(id, auth);
	}

//	@PostMapping(path = "cart", consumes = "application/json")
//	@ResponseStatus(HttpStatus.CREATED)
//	public Iterable<LineItem> postCartItem(@RequestBody LineItem	lineItem,Authentication authentication)
//	{
//		Iterable<LineItem> items= orderService.addItemToCart(lineItem,authentication);
//		return items;
//	}
	@PostMapping(path = "cart")
	@ResponseStatus(HttpStatus.CREATED)
	public LineItem postCartItem(@RequestPart("item") LineItem item, @RequestParam MultipartFile files[],
			Authentication authentication) throws Exception
	{
		LineItem lineItem = orderService.addItemToCart(item, files, authentication);
		return lineItem;
	}

	@DeleteMapping(path = "cart/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCartItem(@PathVariable("id") UUID id, Authentication authentication)
	{
		orderService.deleteCartItem(id, authentication);
	}

	@GetMapping(path = "cart")
	@Secured("ROLE_USER")
	public Iterable<LineItem> getShoppingCart(Authentication authentication)
	{
		return orderService.getShoppingCart(authentication).getLineItems();
	}

	@PutMapping(path = "cart/{id}")
	public LineItem updateCartItem(@RequestBody LineItem item, @PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.updateItem(id, item, auth);
	}

	@PutMapping(path = "checkout")
	public OrderEntity checkoutCart(Authentication auth)
	{
		return orderService.checkout(auth);
	}

	@GetMapping("search")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<OrderEntity> getPageable(Pageable page, @SearchSpec Specification<OrderEntity> specs,
			Authentication auth)
	{
		return orderService.getOrders(page, specs, auth);

	}

	

}
