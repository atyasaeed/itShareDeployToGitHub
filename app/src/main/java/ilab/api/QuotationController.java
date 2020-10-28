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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.order.Quotation;
import ilab.core.service.QuotationService;
import ilab.dto.RFQDto;

@RestController
@RequestMapping(path = QuotationController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class QuotationController
{
	static final String REST_URL = "/api/quotation";

	@Autowired
	private QuotationService quotationService;

	@GetMapping("/rfqs/search")
	@PreAuthorize("hasRole('ROLE_USER')")
	// TODO: Refactor to return DTO for RFQ
	public Page<RFQDto> getRFM(Authentication auth, Pageable page)
	{
		return quotationService.readyFMs(auth, page);
	}

	@GetMapping("/search")
	@PreAuthorize("hasRole('ROLE_USER')")
	// TODO: Refactor to return DTO for RFQ
	public Page<Quotation> get(Authentication auth, Pageable page)
	{
		return quotationService.getQuotations(auth, page);
	}

	@PutMapping("admin/{id}/select")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Quotation adminAccept(@PathVariable("id") UUID id)
	{
		return quotationService.select(id);
	}

	@GetMapping("/admin/search")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<Quotation> getItemQuotes(Pageable page, @RequestParam(name = "id", required = true) UUID id)
	{
		return quotationService.getItemQuotes(page, id);
	}

}
