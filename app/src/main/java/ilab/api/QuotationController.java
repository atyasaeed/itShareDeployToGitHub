package ilab.api;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.Quotation;
import ilab.core.service.QuotationService;

@RestController
@RequestMapping(path = QuotationController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class QuotationController
{
	static final String REST_URL = "/api/quotation";

	@Autowired
	private QuotationService quotationService;

	@PostMapping("/{id}") // lineItem id
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<Quotation> requestForQuotations(Authentication auth, @PathVariable("id") UUID id)
	{
		return quotationService.requestForQuotation(id);
	}

	@PostMapping("manual/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Quotation manualQuotation(Authentication auth, @RequestPart("item") LineItem item,
			@RequestPart("org") Organization org)
	{
		return quotationService.makeManualQuotation(item, org);
	}

	@GetMapping("search/accepted")
	@PreAuthorize("isAuthenticated()")
	public Page<Quotation> getAcceptedQuotation(Authentication auth, Pageable page)
	{
		return quotationService.findByAccepted(auth, page);
	}

	@GetMapping("search/sent")
	@PreAuthorize("isAuthenticated()")
	public Page<Quotation> getSentQuotation(Authentication auth, Pageable page)
	{
		return quotationService.findBySent(auth, page);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public void rejectQuotation(Authentication auth, @PathVariable("id") UUID id)
	{
		quotationService.rejectQuotatation(auth, id);
	}

	@PutMapping("/accept/{id}")
	@PreAuthorize("isAuthenticated()")
	public Quotation acceptQuotation(Authentication auth, @RequestBody Quotation quotation, @PathVariable("id") UUID id)
	{
		return quotationService.acceptQuotation(auth, quotation, id);
	}

	@PutMapping("/admin/approve/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Quotation adminApproval(Authentication auth, @PathVariable("id") UUID id)
	{
		return quotationService.adminApproval(auth, id);
	}

	@DeleteMapping("/admin/reject/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void adminRefusal(Authentication auth, @PathVariable("id") UUID id)
	{
		quotationService.adminRefusal(auth, id);
	}

	@GetMapping("admin/partner/accepted")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<Quotation> searchForPartnerAccepted(Authentication auth, Pageable page)
	{
		return quotationService.adminSearchAcceptedPartnerQuotations(auth, page);
	}
}
