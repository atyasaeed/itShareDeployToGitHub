package ilab.core.service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.LineItemStatus;
import ilab.core.domain.order.Quotation;
import ilab.core.domain.order.QuotationStatus;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.User;
import ilab.core.repository.LineItemRepository;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.QuotationRepository;
import ilab.dto.RFQDto;
import ilab.utils.exception.IllegalRequestDataException;

@Service
@Transactional
public class QuotationService
{

	@Autowired
	private QuotationRepository quotationRepo;

	@Autowired
	private UserService userService;
	@Autowired
	private OrganizationRepository orgRepo;
	@Autowired
	private LineItemRepository lineItemRepo;

	public Page<Quotation> getItemQuotes(Pageable page, UUID id)
	{
		List<QuotationStatus> eligibleStatus = Arrays.asList(QuotationStatus.QUOTED, QuotationStatus.SELECTED);
		return quotationRepo.findByStatusInAndLineItem_id(eligibleStatus, id, page);
	}

	public Page<RFQDto> readyFMs(Authentication auth, Pageable page)
	{
		User user = userService.findUser(auth);
		if (orgValidation(user.getDefaultOrg()))
			return lineItemRepo.findByStatusAndServiceIn(LineItemStatus.RFM, user.getDefaultOrg().getServices(), page);
		// TODO: should return empty page;
		return null;
	}

	public Quotation create(Authentication auth, UUID itemId, Quotation quotation)
	{
		LineItem lineItem = lineItemRepo.findById(itemId).orElseThrow();
		Organization org = orgRepo.findByOwner_usernameAndServicesContainingAndStatusAndType(auth.getName(),
				lineItem.getService(), OrganizationStatus.ACTIVE, OrganizationType.PARTNER).orElseThrow();

		quotation.setLineItem(lineItem);
		if (validateQuotation(quotation) && lineItem.getStatus().equals(LineItemStatus.RFM))
		{
			quotation.setPartner(org);
			quotation.setStatus(QuotationStatus.QUOTED);
			quotation.setPlacedBy(org.getOwner());
			return quotationRepo.save(quotation);
		}
		return null;

	}

	public Quotation select(UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();
		LineItem item = quotation.getLineItem();

		if (quotation.getStatus() == QuotationStatus.QUOTED
				&& (item.getStatus() == LineItemStatus.RFM || item.getStatus() == LineItemStatus.HRFQ))
		{
			quotation.setStatus(QuotationStatus.SELECTED);
			item.setUnitPrice(quotation.getUnitPrice());
			item.setDuration(quotation.getDuration());
			if (item.getQuotation() != null)
			{
				item.getQuotation().setStatus(QuotationStatus.QUOTED);
				quotationRepo.save(item.getQuotation());
			}
			item.setQuotation(quotation);
			return quotationRepo.save(quotation);
		}
		return null;
	}

	public Page<Quotation> getQuotations(Authentication auth, Pageable page)
	{
		User user = userService.findUser(auth);
		return quotationRepo.findByPartnerAndStatus(user.getDefaultOrg(), QuotationStatus.QUOTED, page);
	}

	private boolean orgValidation(Organization org)
	{
		if (org.getStatus().equals(OrganizationStatus.ACTIVE) && org.getType() == OrganizationType.PARTNER)
			return true;
		return false;
	}

	public boolean validateQuotation(Quotation quotation)
	{
		if (quotation.getDuration() == 0)
			throw new IllegalRequestDataException("fill work Days");
		if (quotation.getUnitPrice() == null)
			throw new IllegalRequestDataException("fill price");

		return true;
	}
}
