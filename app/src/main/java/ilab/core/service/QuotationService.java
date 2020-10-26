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

	public Page<Quotation> adminSearchRRFQ(Pageable page, UUID id)
	{
		return quotationRepo.findByStatusAndLineItem_id(QuotationStatus.QUOTED, id, page);
	}

	public Page<LineItem> readyRFQitem(Authentication auth, Pageable page)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow();
		if (orgValidation(user.getDefaultOrg()))
		{
			return lineItemRepo.findByStatusAndServiceIn(LineItemStatus.RRFQ, user.getDefaultOrg().getServices(), page);
		}
		return null;

	}

	public Quotation PartnerQuote(Authentication auth, Quotation quotation)
	{
		Organization org = orgRepo.findByOwner_usernameAndServicesAndStatusAndType(auth.getName(),
				quotation.getLineItem().getService(), OrganizationStatus.ACTIVE, OrganizationType.PARTNER)
				.orElseThrow();
		if (orgValidation(org) && quotationValidation(quotation)
				&& quotation.getLineItem().getStatus().equals(LineItemStatus.RRFQ))
		{
			quotation.setPartner(org);
			quotation.setStatus(QuotationStatus.QUOTED);
			quotation.setPlacedBy(org.getOwner());
			return quotationRepo.save(quotation);
		}
		return null;

	}

	public Quotation adminSelect(UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();

		if (quotation.getStatus().equals(QuotationStatus.QUOTED))
		{
			quotation.setStatus(QuotationStatus.SELECTED);
			return quotationRepo.save(quotation);
		}
		return null;
	}

	public Page<Quotation> getMyQuoted(Authentication auth, Pageable page)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName()).orElseThrow();
		return quotationRepo.findByPartnerAndStatus(user.getDefaultOrg(), QuotationStatus.QUOTED, page);
	}

	private boolean orgValidation(Organization org)
	{
		if (org.getStatus().equals(OrganizationStatus.ACTIVE) && org.getType() == OrganizationType.PARTNER)
		{
			return true;
		}
		return false;
	}

	public boolean quotationValidation(Quotation quotation)
	{
		if (quotation.getDuration() == 0)
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
