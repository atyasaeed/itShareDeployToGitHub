package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import ilab.core.domain.LineItem;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = LineItemController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasRole('ROLE_USER')")
public class LineItemController
{
	static final String REST_URL = "/api/items";
	@Autowired
	private OrderService orderService;

//	@PutMapping(path = "/{id}/approveQuote")
//	public LineItem approveQuote(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.acceptQuote(id, auth);
//	}

	@PutMapping(path = "/{id}/cancel")
	public LineItem cancelItem(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.cancelItem(id, auth);
	}

//	@PutMapping(path = "/{id}/rejectQuote")
//	public LineItem rejectQuote(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.rejectItemQuote(id, auth);
//	}

//	@PostMapping(path = "cart", consumes = "application/json")
//	@ResponseStatus(HttpStatus.CREATED)
//	public Iterable<LineItem> postCartItem(@RequestBody LineItem	lineItem,Authentication authentication)
//	{
//		Iterable<LineItem> items= orderService.addItemToCart(lineItem,authentication);
//		return items;
//	}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public LineItem postCartItem(@RequestPart("item") LineItem item, @RequestParam MultipartFile files[],
			Authentication authentication) throws Exception
	{
		LineItem lineItem = orderService.addItemToCart(item, files, authentication);
		return lineItem;
	}

	@DeleteMapping(path = "{id}")
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

	

//	@GetMapping("search")
//	@PreAuthorize("hasRole('ROLE_USER')")
//	public Page<LineItem> getPageable(Pageable page, @SearchSpec Specification<OrderEntity> specs,
//			Authentication auth)
//	{
//		return orderService.getOrders(page, specs, auth);
//
//	}
}
