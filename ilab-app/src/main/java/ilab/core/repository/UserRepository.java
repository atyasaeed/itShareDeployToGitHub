package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.User;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface UserRepository extends CrudRepository<User, UUID>
{
	User findByUsername(String username);
}
