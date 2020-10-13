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
import ilab.core.domain.user.*;

public interface OrganizationUserRepository
		extends PagingAndSortingRepository<OrganizationUser, UUID>, JpaSpecificationExecutor<OrganizationUser>
{
	Optional<OrganizationUser> findByUserAndOrg(User user, Organization org);

	Page<OrganizationUser> findByUser_usernameIgnoreCase(String username, Pageable page);

	Page<OrganizationUser> findByOrg_owner_usernameIgnoreCase(String username, Pageable page);

	Page<OrganizationUser> findByOrg(Organization org, Pageable page);

	Optional<OrganizationUser> findByIdAndUser_usernameIgnoreCase(UUID id, String username);

	

	Page<OrganizationUser> findByOrg_typeAndUser_usernameIgnoreCaseAndRoleNot( Pageable page, OrganizationType type,String username,Role role);

}
