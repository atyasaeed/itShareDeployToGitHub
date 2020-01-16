package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Account;
import ilab.core.domain.FileAsset;

@Repository
public interface FileAssetRepository extends CrudRepository<FileAsset, UUID>
{
	Optional<FileAsset> findByIdAndAccount(UUID id,Account account);
}
