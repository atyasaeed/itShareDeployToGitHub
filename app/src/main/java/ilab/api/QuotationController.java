package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.user.Quotation;
import ilab.core.service.QuotationService;

@RestController
@RequestMapping(path = QuotationController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class QuotationController
{
	static final String REST_URL = "/api/quotation";

	@Autowired
	private QuotationService quotationService;

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<LineItem> getRFQ(Authentication auth, Pageable page)
	{
		return quotationService.readyRFQitem(auth, page);
	}

	@PostMapping("/quote")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Quotation quote(Authentication auth, @RequestBody Quotation quotation)
	{
		return quotationService.PartnerQuote(auth, quotation);
	}

	@GetMapping("admin/search/{id}/quoted")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<Quotation> quotedByPartner(Pageable page, @PathVariable("id") UUID id)
	{
		return quotationService.adminSearchRRFQ(page, id);
	}

	@PutMapping("admin/{id}/select")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Quotation adminAccept(@PathVariable("id") UUID id)
	{
		return quotationService.adminSelect(id);
	}

}
