package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;

@Repository
@Transactional
public interface ServiceRepository extends PagingAndSortingRepository<Service, UUID>,JpaSpecificationExecutor<Service>
{
	
}
