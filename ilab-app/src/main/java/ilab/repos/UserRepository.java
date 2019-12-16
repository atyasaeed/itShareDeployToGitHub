package ilab.repos;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.domain.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long>
{
	User findByUsername(String username);
}
