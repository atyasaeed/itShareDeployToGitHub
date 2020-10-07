package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import ilab.core.domain.user.Address;

public interface AddressRepository extends PagingAndSortingRepository<Address, UUID>, JpaSpecificationExecutor<Address>
{
	void deleteByIdAndUser_username(UUID id, String username);

	Optional<Address> findByIdAndUser_username(UUID id, String username);
}
