package ilab.api;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
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

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.OrderEntity;
import ilab.core.domain.order.OrderStatus;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = OrderController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class OrderController
{
	static final String REST_URL = "/api/order";
	@Autowired
	private OrderService orderService;

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem ReadyForQuotation(@PathVariable("id")UUID id,Authentication auth ) {
		return orderService.changeToRRFQ(id, auth);
		
	}
	

	@GetMapping()
	public Iterable<OrderEntity> getOrders(Authentication auth)
	{
		return orderService.getOrders(auth);
	}

	@PutMapping(path = "/{id}/approveQuote")
	public OrderEntity approveQuote(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.acceptQuote(id, auth);
	}

	@PutMapping(path = "/{id}/cancel")
	public OrderEntity cancelOrder(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.cancelOrder(id, auth);
	}

	@PutMapping(path = "/{id}/rejectQuote")
	public OrderEntity rejectQuote(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.rejectQuote(id, auth);
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

	@GetMapping(path = "{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity getOrder(@PathVariable("id") UUID orderId)
	{
		return orderService.getOrder(orderId);
	}

	@PutMapping(path = "/{id}/quote")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity quote(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.quote(id, auth);
	}

	@PutMapping(path = "/{id}/rejectOrder")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity rejectOrder(@PathVariable("id") UUID id, @RequestBody(required = false) OrderEntity order,
			Authentication auth)
	{
		return orderService.rejectOrder(id, order, auth);
	}

	@PutMapping(path = "/{id}/finish")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity finishOrder(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.finishOrder(id, auth);
	}

	@PutMapping(path = "/{id}/deliver")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity deliverOrder(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.deliverOrder(id, auth);
	}

	@PutMapping(path = "/{id}/process")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity processOrder(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.processOrder(id, auth);
	}

	@PutMapping(path = "lineItem")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem updateCartItem(@RequestBody LineItem item, Authentication auth)
	{
		return orderService.updateItem(item);
	}

	@PutMapping(path = "/{id}/expire")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public OrderEntity expireOrderQuotation(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.expireOrder(id, auth);
	}

	@GetMapping("search/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<OrderEntity> getAllOrders(@PageableDefault(value = 10, sort =
	{ "status" }) Pageable page, @SearchSpec Specification<OrderEntity> specs, Authentication auth,
			@RequestParam(value = "status", required = false) List<OrderStatus> status)
	{
		if (status != null && status.size() > 0)
			specs = filterByStatus(status).and(specs);

		return orderService.getOrders(page, specs);
	}

	@GetMapping("search")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<OrderEntity> getUserOrders(Pageable page, @SearchSpec Specification<OrderEntity> specs,
			Authentication auth, @RequestParam(value = "status", required = false) List<OrderStatus> status)
	{
		if (status != null && status.size() > 0)
			specs = filterByStatus(status).and(specs);

		return orderService.getOrders(page, specs, auth);

	}

	private Specification<OrderEntity> filterByStatus(List<OrderStatus> status)
	{
		return (Root<OrderEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			predicates.add(root.get("status").in(status));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
