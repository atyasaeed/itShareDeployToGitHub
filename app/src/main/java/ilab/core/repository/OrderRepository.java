package ilab.core.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.order.OrderEntity;
import ilab.core.domain.order.OrderStatus;

@Repository
@Transactional
public interface OrderRepository extends PagingAndSortingRepository<OrderEntity, UUID>,JpaSpecificationExecutor<OrderEntity>
{
	@Query("select o from OrderEntity o where o.status=?1 and o.organization.id=?2")
	List<OrderEntity> findShoppingCart(OrderStatus status,UUID orgId,Pageable page);
	@Query("select o from OrderEntity o where o.status=?1")
	List<OrderEntity> findGalleryCart(OrderStatus status,Pageable page);
	Page<OrderEntity> findByStatus(OrderStatus status,Pageable page);
	@Query("select o from OrderEntity o where o.status<>?1 and o.organization.id=?2")
	List<OrderEntity> findByOrganization(OrderStatus status,UUID orgId,Pageable page);
	
	@Query("select o from OrderEntity o where o.status<>?1 and o.organization.owner.id=?2")
	List<OrderEntity> findAllByUserId(OrderStatus status,UUID userId,Pageable page);
}
