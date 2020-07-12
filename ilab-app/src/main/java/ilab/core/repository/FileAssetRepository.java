package ilab.core.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Account;
import ilab.core.domain.FileAsset;

@Repository
public interface FileAssetRepository extends PagingAndSortingRepository<FileAsset, UUID>,JpaSpecificationExecutor<FileAsset>
{
	Optional<FileAsset> findByIdAndAccount(UUID id,Account account);
}
