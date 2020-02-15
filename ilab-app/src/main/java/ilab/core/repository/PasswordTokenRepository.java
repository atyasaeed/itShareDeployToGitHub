package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.PasswordResetToken;
import ilab.core.domain.User;

@Repository
public interface PasswordTokenRepository extends CrudRepository<PasswordResetToken, UUID>
{
	PasswordResetToken findByUserAndUsedFalse(User user);
}
