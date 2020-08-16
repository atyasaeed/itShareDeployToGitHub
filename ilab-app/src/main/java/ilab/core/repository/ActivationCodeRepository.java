package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.user.ActivationCode;



@Repository
@Transactional
public interface ActivationCodeRepository extends PagingAndSortingRepository<ActivationCode, UUID>,JpaSpecificationExecutor<ActivationCode>
{
	Optional<ilab.core.domain.user.ActivationCode> findByUser_UsernameIgnoreCaseAndUsedFalse(String username);
	Optional<ActivationCode> findByUser_Id(UUID userId);
	Optional<ActivationCode> findByIdAndUsedFalseAndSentFalse(UUID id);
}
