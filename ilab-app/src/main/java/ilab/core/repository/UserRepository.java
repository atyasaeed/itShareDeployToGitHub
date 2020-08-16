package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.User;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface UserRepository extends PagingAndSortingRepository<User, UUID>,JpaSpecificationExecutor<User>
{
	Optional<User> findByUsernameIgnoreCase(String username);
	Optional<User> findByemailIgnoreCase(String email);
	boolean existsByUsername(String username);
}
