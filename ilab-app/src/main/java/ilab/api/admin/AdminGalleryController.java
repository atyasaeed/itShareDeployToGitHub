package ilab.api.admin;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.repository.LineItemRepository;
import ilab.core.service.OrderService;

//@RestController
//@RequestMapping(path = AdminGalleryController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminGalleryController
{
	static final String REST_URL="/api/admin/gallery";
//	@Autowired
//	private OrderService orderService;
//	@Autowired
//	private LineItemRepository lineItemRepo;
//	
//	@PutMapping()
//	@PreAuthorize("hasRole('ROLE_ADMIN')")
//	public void convertCartToGallery(Authentication auth)
//	{
//		orderService.convertCartToGallery(auth);
//	}
//	@DeleteMapping("/{id}")
//	@PreAuthorize("hasRole('ROLE_ADMIN')")
//	public void RemoveItemFromGallery(@PathVariable("id") UUID id,Authentication auth)
//	{
//		lineItemRepo.deleteById(id);
//	}
	
	
}
