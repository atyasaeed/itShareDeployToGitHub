package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import ilab.core.domain.City;
import ilab.core.domain.State;

public interface CityRepository extends PagingAndSortingRepository<City, UUID>, JpaSpecificationExecutor<City>
{

	Page<City> findAllByState(State state,Pageable page);
	
}
