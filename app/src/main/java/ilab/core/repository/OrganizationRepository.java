package ilab.core.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;

@Repository
@Transactional
public interface OrganizationRepository
		extends PagingAndSortingRepository<Organization, UUID>, JpaSpecificationExecutor<Organization>
{
	Optional<Organization> findByIdAndOwner_username(UUID id, String username);

	Page<Organization> findByOwner_username(String username, Pageable page);

	@Query(value = "SELECT DISTINCT org FROM Organization org JOIN org.services a WHERE a = ?1")
	List<Organization> findAllByServicesAndTypeAndStatus( Service service,OrganizationType type,OrganizationStatus status);

}
