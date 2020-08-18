package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.order.LineItem;
@Repository
@Transactional
public interface LineItemRepository extends PagingAndSortingRepository<LineItem, UUID>,JpaSpecificationExecutor<LineItem>
{
	Optional<LineItem> findOneByIdAndOrderEntity_Account_Id(UUID id,UUID accouUuid);
}
