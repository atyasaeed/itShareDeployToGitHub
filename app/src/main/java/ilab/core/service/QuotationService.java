package ilab.core.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.OrderStatus;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.Quotation;
import ilab.core.domain.user.QuotationStatus;
import ilab.core.domain.user.User;
import ilab.core.repository.LineItemRepository;
import ilab.core.repository.OrderRepository;
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
	private OrderRepository orderRepo;

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private OrganizationRepository orgRepo;
	@Autowired
	private LineItemRepository lineItemRepo;

	public List<Quotation> requestForQuotation(UUID id)
	{
		LineItem item = lineItemRepo.findById(id).orElseThrow();
		List<Organization> list = orgRepo.findAllByServicesAndTypeAndStatus(item.getService(), OrganizationType.PARTNER,
				OrganizationStatus.ACTIVE);
		List<Quotation> quoteList = new ArrayList<Quotation>();
		for (Organization org : list)
		{
			quoteList.add(makeManualQuotation(item, org));
		}
		return quoteList;
	}

	public Quotation makeManualQuotation(LineItem item, Organization org)
	{
		if (!org.getStatus().equals(OrganizationStatus.ACTIVE))
		{
			throw new IllegalRequestDataException("Organization must be active");
		}

		if (!org.getType().equals(OrganizationType.PARTNER))
		{
			throw new IllegalRequestDataException("Organization must be Partner");

		}
		if (!org.getServices().contains(item.getService()))
		{
			throw new IllegalRequestDataException("Organization must contain the same service of this item ");

		}
		if (!item.getOrderEntity().getStatus().equals(OrderStatus.PENDING))
		{
			throw new IllegalRequestDataException("Order must be pending ");

		}

		Quotation quotation = new Quotation();
		quotation.setLineItem(item);
		quotation.setOrg(org);
		quotation.setPlacedBy(item.getOrderEntity().getPlacedBy());
		quotation.setStatus(QuotationStatus.QUOTE_SENT);

		return quotationRepo.save(quotation);

	}

	public Quotation acceptQuotation(Authentication auth, Quotation quotationCopyFrom, UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();
		Organization org = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow().getDefaultOrg();
		if (!quotation.getOrg().getId().equals(org.getId()))
		{
			throw new IllegalRequestDataException("Access is denies for this quotation");

		}
		if (!org.getStatus().equals(OrganizationStatus.ACTIVE))
		{
			throw new IllegalRequestDataException("Organization must be active");
		}

		if (!org.getType().equals(OrganizationType.PARTNER))
		{
			throw new IllegalRequestDataException("Organization must be Partner");

		}
		if (quotationCopyFrom.getUnitPrice() == null)
		{
			throw new IllegalRequestDataException("Set price please");

		}
		if (quotationCopyFrom.getEndDate() == null)
		{
			throw new IllegalRequestDataException("Set End Date please");

		}

		quotation.setUnitPrice(quotationCopyFrom.getUnitPrice());
		quotation.setEndDate(quotationCopyFrom.getEndDate());
		quotation.setStatus(QuotationStatus.QUOTE_ACCEPTED_PARTNER);
		return quotationRepo.save(quotation);

	}

	public void rejectQuotatation(Authentication auth, UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();
		User user = userRepo.findByemailIgnoreCase(auth.getName()).orElseThrow();
		if (user.getDefaultOrg().equals(quotation.getOrg()))
		{
			throw new IllegalRequestDataException(
					"The quotation must be placed by the user or assigned to organization owned by the user  ");
		}

		quotationRepo.delete(quotation);

	}

	public Page<Quotation> findBySent(Authentication auth, Pageable page)
	{
		Organization org = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow().getDefaultOrg();
		return quotationRepo.findByOrgAndStatus(org, QuotationStatus.QUOTE_SENT, page);
	}

	public Page<Quotation> findByAccepted(Authentication auth, Pageable page)
	{
		Organization org = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow().getDefaultOrg();
		return quotationRepo.findByOrgAndStatus(org, QuotationStatus.QUOTE_ACCEPTED_PARTNER, page);
	}

	public Page<Quotation> adminSearchAcceptedPartnerQuotations(Authentication auth, Pageable page)
	{
		return quotationRepo.findByStatus(QuotationStatus.QUOTE_ACCEPTED_PARTNER, page);
	}

	public Quotation adminApproval(Authentication auth, UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();

		if (quotation.getStatus().equals(QuotationStatus.QUOTE_ACCEPTED_PARTNER))
		{

			quotation.setStatus(QuotationStatus.QUOTE_APPROVED_ADMIN);
			return quotationRepo.save(quotation);
		}
		return null;
	}

	public void adminRefusal(Authentication auth, UUID id)
	{
		Quotation quotation = quotationRepo.findById(id).orElseThrow();

		if (quotation.getStatus().equals(QuotationStatus.QUOTE_ACCEPTED_PARTNER))
		{

			quotationRepo.delete(quotation);
		}
	}

}
