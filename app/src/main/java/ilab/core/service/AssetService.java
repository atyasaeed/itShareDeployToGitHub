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

import ilab.core.domain.FileAsset;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.User;
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
			User user=userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
			
			return assetsRepo.findByIdAndOrganization(assetId,user.getDefaultOrg());

	}
	public Optional<FileAsset> getAssetFile(UUID assetId)
	{
			return assetsRepo.findById(assetId);

	}
	public Page<FileAsset> getFiles(Pageable page, Specification<FileAsset> specs, Authentication auth)
	{
		User user = userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
		Page<FileAsset> results=assetsRepo.findAll(filterByOrgId(user.getDefaultOrg().getId()).and(specs), page);
		return results; 

	}
	public Specification<FileAsset> filterByOrgId(UUID orgId)
	{
		return (Root<FileAsset> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();
			
			Path<Organization> organizationPath = root.<Organization>get("organization");
			predicates.add(cb.equal(organizationPath.<UUID>get("id"), orgId));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
