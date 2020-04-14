package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.LineItem;
@Repository
@Transactional(value = TxType.SUPPORTS)
public interface LineItemRepository extends PagingAndSortingRepository<LineItem, UUID>,JpaSpecificationExecutor<LineItem>
{
	LineItem findOneByIdAndOrderEntity_Account_Id(UUID id,UUID accouUuid);
}
