package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import ilab.core.domain.LineItem;

public interface LineItemRepository extends CrudRepository<LineItem, UUID>
{
	LineItem findOneByIdAndOrderEntity_Account_Id(UUID id,UUID accouUuid);
}
