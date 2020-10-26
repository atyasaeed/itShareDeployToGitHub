package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.Quotation;
import ilab.core.domain.user.QuotationStatus;

@Repository
@Transactional
public interface QuotationRepository
		extends PagingAndSortingRepository<Quotation, UUID>, JpaSpecificationExecutor<Quotation>
{
	Page<Quotation> findByPartnerAndStatus(Organization org, QuotationStatus status, Pageable page);

	Page<Quotation> findByStatusAndLineItem_id(QuotationStatus status, UUID id, Pageable page);

}
