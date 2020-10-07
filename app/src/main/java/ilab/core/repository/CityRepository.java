package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.City;
import ilab.core.domain.State;

@Repository
@Transactional
public interface CityRepository extends PagingAndSortingRepository<City, UUID>, JpaSpecificationExecutor<City>
{

	Page<City> findByState_Id(UUID id, Pageable page, Specification<City> specs);

}
