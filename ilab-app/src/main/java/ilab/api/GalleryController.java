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
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@RequestMapping(path = GalleryController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)

public class GalleryController
{
	static final String REST_URL="/api/gallery";
	@Autowired
	private OrderService orderService;
	@Autowired
	private LineItemRepository lineItemRepo;
	@GetMapping("search")
	public Page<LineItem> getGaleryItems(@PageableDefault(value = 10, sort =
		{ "service.name" }) Pageable page, @SearchSpec Specification<LineItem> specs)
	{
		Specification<LineItem> combined=filterGalleryItems( ).and(specs);
		return lineItemRepo.findAll(combined, page);
	}
	@PostMapping(path = "/{id}/clone")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ROLE_USER')")
	public LineItem cloneGalleryItem(@PathVariable("id") UUID id,Authentication authentication) throws Exception
	{
		LineItem lineItem= orderService.cloneGalleryItemToCart(id,authentication);
		return lineItem;
	}
	@PutMapping()
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void convertCartToGallery(Authentication auth)
	{
		orderService.convertCartToGallery(auth);
	}
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void RemoveItemFromGallery(@PathVariable("id") UUID id,Authentication auth)
	{
		lineItemRepo.deleteById(id);
	}
	
	private  Specification<LineItem> filterGalleryItems() {
		return  (Root<LineItem> root, CriteriaQuery<?> query, CriteriaBuilder cb)->{
			List<Predicate> predicates = new ArrayList<>();
			
			Path<OrderEntity> orderPath=root.<OrderEntity>get("orderEntity");
			predicates.add(cb.equal(orderPath.<OrderStatus>get("status"), OrderStatus.GALLERY_CART));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
