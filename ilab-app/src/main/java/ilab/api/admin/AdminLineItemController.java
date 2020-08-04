package ilab.api.admin;

import java.util.Set;
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
import ilab.core.domain.OrderEntity;
import ilab.core.domain.Reason;
import ilab.core.service.OrderService;

//@RestController
//@RequestMapping(path = AdminLineItemController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminLineItemController
{
	static final String REST_URL = "/api/admin/items";
	@Autowired
	private OrderService orderService;

//	@PutMapping(path = "/{id}/quote")
//	public LineItem quote(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.quoteItem(id, auth);
//	}
//	@PutMapping(path = "/{id}/rejectItem")
//	public LineItem rejectItem(@PathVariable("id") UUID id, @RequestBody(required = false) LineItem item, Authentication auth)
//	{
//		
//		return orderService.rejectItem(id, item, auth);
//	}
//	@PutMapping(path = "/{id}/process")
//	public LineItem process(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.processItem(id, auth);
//	}
//	@PutMapping(path = "/{id}/finish")
//	public LineItem finish(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.finishItem(id, auth);
//	}
//	@PutMapping(path = "/{id}/deliver")
//	public LineItem deliver(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.deliverItem(id, auth);
//	}
//	@PutMapping(path = "/{id}/reset")
//	public LineItem reset(@PathVariable("id") UUID id, Authentication auth)
//	{
//		return orderService.reset(id, auth);
//	}

}
