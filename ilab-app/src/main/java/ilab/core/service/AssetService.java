package ilab.core.service;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.Account;
import ilab.core.domain.FileAsset;
import ilab.core.domain.User;
import ilab.core.repository.FileAssetRepository;
import ilab.core.repository.UserRepository;

@Service
@Transactional
public class AssetService
{
	@Autowired UserRepository userRepo;
	@Autowired FileAssetRepository assetsRepo;
	public Optional<FileAsset> getAssetFile(UUID assetId,Authentication auth)
	{
			User user=userRepo.findByUsername(auth.getName());
			Account account=user.getAccounts().iterator().next();
			
			return assetsRepo.findByIdAndAccount(assetId,account);

	}
}
