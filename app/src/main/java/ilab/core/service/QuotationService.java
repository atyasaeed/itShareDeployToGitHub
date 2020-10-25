package ilab.core.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.LineItemStatus;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.Quotation;
import ilab.core.domain.user.QuotationStatus;
import ilab.core.domain.user.User;
import ilab.core.repository.LineItemRepository;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.QuotationRepository;
import ilab.core.repository.UserRepository;
import ilab.utils.exception.IllegalRequestDataException;

@Service
@Transactional
public class QuotationService
{

	@Autowired
	private QuotationRepository quotationRepo;

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private OrganizationRepository orgRepo;
	@Autowired
	private LineItemRepository lineItemRepo;

	public Page<Quotation> adminSearchRRFQ(Pageable page)
	{
		return quotationRepo.findByStatus(QuotationStatus.QUOTED_PARTNER, page);
	}

	public Page<LineItem> pendingLineItem(Authentication auth, Pageable page, UUID id)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow();
		if (orgValidation(user.getDefaultOrg()))
		{
			return lineItemRepo.findByService_idAndStatus(id, LineItemStatus.RRFQ, page);
		}
		return null;

	}

	public Quotation Rffq(Authentication auth, Quotation quotation)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow();
		LineItem item = lineItemRepo.findById(quotation.getLineItem().getId()).orElseThrow();
		System.out.println("ahmed");
		if (orgValidation(user.getDefaultOrg()) && quotationValidation(quotation)
				&& item.getStatus().equals(LineItemStatus.RRFQ))
		{
			quotation.setPartner(user.getDefaultOrg());
			quotation.setStatus(QuotationStatus.QUOTED_PARTNER);
			quotation.setPlacedBy(item.getOrderEntity().getPlacedBy());
			quotationRepo.save(quotation);
			return quotation;
		}
		return null;

	}
	
	public Quotation adminChoose(UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();
		if (quotation.getStatus().equals(QuotationStatus.QUOTED_PARTNER))
		{
			quotation.setStatus(QuotationStatus.QUOTE_CHOSEN);
			return quotation;
		}
		return null;
	}

	public Page<Quotation> getMyQuoted(Authentication auth, Pageable page)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName()).orElseThrow();
		return quotationRepo.findByPartnerAndStatus(user.getDefaultOrg(), QuotationStatus.QUOTED_PARTNER, page);
	}

	private boolean orgValidation(Organization org)
	{
		if (org.getStatus().equals(OrganizationStatus.ACTIVE) && org.getType().equals(OrganizationType.PARTNER))
		{
			return true;
		}
		return false;
	}

	public boolean quotationValidation(Quotation quotation)
	{
		if (quotation.getWorkDays() == 0)
		{
			throw new IllegalRequestDataException("fill work Days");
		}
		if (quotation.getUnitPrice() == null)
		{
			throw new IllegalRequestDataException("fill price");

		}

		return true;
	}
}
