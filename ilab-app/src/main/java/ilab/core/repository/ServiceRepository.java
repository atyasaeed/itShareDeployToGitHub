package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface ServiceRepository extends PagingAndSortingRepository<Service, UUID>
{
	//TODO: just for testing
	@Query("UPDATE Service s SET s.id = :newId WHERE s.id = :oldId")
	void updateTestingData(@Param("oldId") UUID id1, @Param("newId") UUID id2);
}
