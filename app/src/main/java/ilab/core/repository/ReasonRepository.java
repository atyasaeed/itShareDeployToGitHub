package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Reason;

@Repository
@Transactional
public interface ReasonRepository extends PagingAndSortingRepository<Reason, UUID>,JpaSpecificationExecutor<Reason>
{
	
}
