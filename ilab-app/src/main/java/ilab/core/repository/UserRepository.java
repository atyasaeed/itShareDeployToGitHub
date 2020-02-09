package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.User;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface UserRepository extends PagingAndSortingRepository<User, UUID>
{
	User findByUsername(String username);
}
