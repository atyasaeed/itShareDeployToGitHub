package ilab.core.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderType;

@Repository
public interface OrderRepository extends PagingAndSortingRepository<OrderEntity, UUID>
{
	List<OrderEntity> findByType(OrderType type,Pageable page);
}
