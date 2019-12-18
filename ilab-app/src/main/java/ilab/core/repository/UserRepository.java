package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.User;

@Repository
public interface UserRepository extends CrudRepository<User, UUID>
{
	User findByUsername(String username);
}
