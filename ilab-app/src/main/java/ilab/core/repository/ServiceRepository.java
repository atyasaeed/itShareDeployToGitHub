package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;

@Repository
public interface ServiceRepository extends PagingAndSortingRepository<Service, UUID>
{
	

}
