package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.Organization;

@Repository
@Transactional
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, UUID>,JpaSpecificationExecutor<Organization>
{
	Optional<Organization> findByIdAndOwner_username(UUID id,String username);
}
