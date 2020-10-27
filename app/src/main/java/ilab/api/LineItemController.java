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

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.Quotation;
import ilab.core.service.OrderService;
import ilab.core.service.QuotationService;

@RestController
@RequestMapping(path = LineItemController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasRole('ROLE_USER')")
public class LineItemController
{
	static final String REST_URL = "/api/item";
	@Autowired
	private OrderService orderService;
	@Autowired
	private QuotationService quotationService;

	@PutMapping("/{id}/RFM")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem ReadyForQuotation(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.changeItemToRFM(id, auth);

	}

	@PutMapping(path = "/{id}/cancel")
	public LineItem cancelItem(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.cancelItem(id, auth);
	}

	@PutMapping(path = "/{id}/rejectQuote")
	public LineItem rejectQuote(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.rejectItemQuote(id, auth);
	}

	@PutMapping(path = "/{id}/approveQuote")
	public LineItem approveQuote(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.acceptItemQuote(id, auth);
	}

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

	@PostMapping(path = "/{id}/quote")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Quotation quote(@PathVariable("id") UUID id, @RequestBody Quotation quotation, Authentication auth)
	{
		return quotationService.create(auth, id, quotation);
	}

	@PutMapping(path = "/{id}/rejectItem")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem rejectItem(@PathVariable("id") UUID id, @RequestBody(required = false) LineItem item,
			Authentication auth)
	{

		return orderService.rejectItem(id, item, auth);
	}

	@PutMapping(path = "/{id}/process")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem process(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.processItem(id, auth);
	}

	@PutMapping(path = "/{id}/finish")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem finish(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.finishItem(id, auth);
	}

	@PutMapping(path = "/{id}/deliver")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem deliver(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.deliverItem(id, auth);
	}

	@PutMapping(path = "/{id}/reset")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem reset(@PathVariable("id") UUID id, Authentication auth)
	{
		return orderService.reset(id);
	}

	@PutMapping("/{id}/holdRFM")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem holdRFQ(@PathVariable("id") UUID id)
	{
		return orderService.changeItemToHoldRFQ(id);

	}

	@PutMapping("/{id}/resumeRFM")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public LineItem resumeRFQ(@PathVariable("id") UUID id)
	{
		return orderService.resumeRFM(id);
	}

}
