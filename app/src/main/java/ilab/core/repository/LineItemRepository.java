package ilab.core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;
import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.LineItemStatus;

@Repository
@Transactional
public interface LineItemRepository
		extends PagingAndSortingRepository<LineItem, UUID>, JpaSpecificationExecutor<LineItem>
{
	Optional<LineItem> findOneByIdAndOrderEntity_Organization_Id(UUID id, UUID orgId);

	Page<LineItem> findByService_idAndStatus(UUID id, LineItemStatus status,Pageable page);
}
