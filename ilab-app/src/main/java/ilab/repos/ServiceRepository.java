package ilab.repos;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.domain.Service;

@Repository
public interface ServiceRepository extends PagingAndSortingRepository<Service, Long>
{
	

}
