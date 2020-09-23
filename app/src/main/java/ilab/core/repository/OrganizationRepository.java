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
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.User;

@Repository
@Transactional
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, UUID>,JpaSpecificationExecutor<Organization>
{
	Optional<Organization> findByIdAndOwner_username(UUID id,String username);
	Page<Organization> findByOwner_username(String username,Pageable page);

//	
//	@Query("select u from Organization u where u.owner in :username")
//	Page<Organization> findOrg(@Param("username") String username);

}
