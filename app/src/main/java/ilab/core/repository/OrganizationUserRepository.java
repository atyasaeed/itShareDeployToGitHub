package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationUser;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;

public interface OrganizationUserRepository
		extends PagingAndSortingRepository<OrganizationUser, UUID>, JpaSpecificationExecutor<OrganizationUser>
{
	Optional<OrganizationUser> findByUserAndOrg(User user, Organization org);

	Page<OrganizationUser> findByUser_usernameIgnoreCase(String username, Pageable page);

	Page<OrganizationUser> findByOrg_owner_usernameIgnoreCase(String username, Pageable page);

	Page<OrganizationUser> findByOrg(Organization org, Pageable page);

	Optional<OrganizationUser> findByIdAndUser_usernameIgnoreCase(UUID id, String username);
	
	Page<OrganizationUser> findByUser_usernameIgnoreCaseAndRoleNotAndRoleOrRole(String username, Pageable page,Role role,Role role1,Role role2);

}
