package ilab.api;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
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
import ilab.core.repository.LineItemRepository;
import ilab.core.service.OrderService;

@RestController
@RequestMapping(path = ShoppingCartController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)

public class ShoppingCartController
{
	static final String REST_URL="/api/cart";
	@Autowired
	private OrderService orderService;
	@Autowired
	private LineItemRepository lineItemRepo;
	@GetMapping()
	@Secured("ROLE_USER")
	public OrderEntity getShoppingCart(Authentication auth)
	{
		return orderService.getShoppingCart(auth);
	}
	
//	@PostMapping(path = "cart", consumes = "application/json")
//	@ResponseStatus(HttpStatus.CREATED)
//	public Iterable<LineItem> postCartItem(@RequestBody LineItem	lineItem,Authentication authentication)
//	{
//		Iterable<LineItem> items= orderService.addItemToCart(lineItem,authentication);
//		return items;
//	}
	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public LineItem postCartItem(@RequestPart("item") LineItem item,@RequestParam MultipartFile files[],Authentication authentication) throws Exception
	{
		LineItem lineItem= orderService.addItemToCart(item,files,authentication);
		return lineItem;
	}
	@DeleteMapping(path = "/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCartItem(@PathVariable("id") UUID id,Authentication authentication)
	{
		orderService.deleteCartItem(id,authentication);
	}

	
	
	@PutMapping()
	public LineItem updateCartItem(@RequestBody LineItem item,Authentication auth)
	{
		return orderService.updateItem(item.getId(), item, auth);
	}
	@PutMapping(path="checkout")
	public OrderEntity checkoutCart(Authentication auth)
	{
		return orderService.checkout(auth);
	}
	
	@GetMapping("search")
	public Page<LineItem> getPageable(Pageable page, @SearchSpec Specification<LineItem> specs,Authentication auth)
	{
		
		OrderEntity order=orderService.getShoppingCart(auth);
		Specification<LineItem> combined=filterByOrderId( order.getId()).and(specs);
		return lineItemRepo.findAll(combined, page);

		
	}
	
	private  Specification<LineItem> filterByOrderId(UUID value) {
		return  (Root<LineItem> root, CriteriaQuery<?> query, CriteriaBuilder cb)->{
			List<Predicate> predicates = new ArrayList<>();
			
			Path<OrderEntity> orderPath=root.<OrderEntity>get("orderEntity");
			predicates.add(cb.equal(orderPath.<UUID>get("id"), value));
			predicates.add(cb.equal(orderPath.<OrderStatus>get("status"), OrderStatus.SHOPPING_CART));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
