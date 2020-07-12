package ilab.core.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
	public Page<FileAsset> getFiles(Pageable page, Specification<FileAsset> specs, Authentication auth)
	{
		User user = userRepo.findByUsername(auth.getName());
		Account account = user.getAccounts().iterator().next();
		Page<FileAsset> results=assetsRepo.findAll(filterByAccountId(account.getId()).and(specs), page);
		return results; 

	}
	public Specification<FileAsset> filterByAccountId(UUID accountId)
	{
		return (Root<FileAsset> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();

			Path<Account> accountPath = root.<Account>get("account");
			predicates.add(cb.equal(accountPath.<UUID>get("id"), accountId));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
