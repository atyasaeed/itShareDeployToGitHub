package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.PasswordResetToken;
import ilab.core.domain.user.User;

@Repository
@Transactional
public interface PasswordTokenRepository extends CrudRepository<PasswordResetToken, UUID>
{
	PasswordResetToken findByUserAndUsedFalse(User user);
	Optional<PasswordResetToken> findByIdAndUsedFalseAndSentFalse(UUID id);
}
