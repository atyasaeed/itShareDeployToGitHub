package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationUser;
import ilab.core.domain.user.User;

public interface OrganizationUserRepository
		extends PagingAndSortingRepository<OrganizationUser, UUID>, JpaSpecificationExecutor<OrganizationUser>
{
	Optional<OrganizationUser> findByUserAndOrg(User user, Organization org);

	Page<OrganizationUser> findAllByUser_username(String username, Pageable page);

	Page<OrganizationUser> findAllByOrg_owner_username(String username, Pageable page);

	Page<OrganizationUser> findAllByOrg(Organization org, Pageable page);

	Optional<OrganizationUser> findByIdAndUser(UUID id, User user);
}
