package ilab.core.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.OrderEntity;
import ilab.core.domain.OrderType;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface OrderRepository extends PagingAndSortingRepository<OrderEntity, UUID>
{
	@Query("select o from OrderEntity o where o.type=?1 and o.account.id=?2")
	List<OrderEntity> findShoppingCart(OrderType type,UUID accountId,Pageable page);
}
