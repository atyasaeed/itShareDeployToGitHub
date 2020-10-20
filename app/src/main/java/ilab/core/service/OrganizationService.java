package ilab.core.service;

import java.io.File;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.FileAsset;
import ilab.core.domain.Service;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.FileAssetRepository;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.ServiceRepository;
import ilab.core.repository.UserRepository;

@org.springframework.stereotype.Service
@Transactional
public class OrganizationService
{
	@Autowired
	private FileAssetRepository assetRepo;
	@Value("${iLab.paths.files}")
	String filesPath;
	@Autowired
	private OrganizationRepository orgRepo;

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private ServiceRepository serviceRepo;

	public Organization updateOrganization(UUID orgId, Organization org, MultipartFile file1, MultipartFile file2,
			MultipartFile file3, MultipartFile file4, Authentication auth) throws IOException
	{
		Organization existingOrg = orgRepo.findByIdAndOwner_username(orgId, auth.getName()).orElseThrow();
		if (org != null)
			BeanUtils.copyProperties(org, existingOrg, "owner", "status", "type", "comReg", "taxId", "frontNatId",
					"backNatId");
		if (file1 != null)
			existingOrg.setComReg(updateFileAsset(org, file1, existingOrg.getComReg(),
					"commercialReg." + FilenameUtils.getExtension(file1.getOriginalFilename())));
		if (file2 != null)
			existingOrg.setTaxId(updateFileAsset(org, file2, existingOrg.getTaxId(),
					"taxId." + FilenameUtils.getExtension(file2.getOriginalFilename())));
		if (file3 != null)
			existingOrg.setFrontNatId(updateFileAsset(org, file3, existingOrg.getFrontNatId(),
					"frontNatId." + FilenameUtils.getExtension(file3.getOriginalFilename())));
		if (file4 != null)
			existingOrg.setBackNatId(updateFileAsset(org, file4, existingOrg.getBackNatId(),
					"backNatId." + FilenameUtils.getExtension(file4.getOriginalFilename())));
		if (auth.getAuthorities().contains(Role.ROLE_REGISTER_PRIVILEGE))
			SecurityContextHolder.getContext().setAuthentication(null);
		return existingOrg;
	}

	private FileAsset updateFileAsset(Organization org, MultipartFile file, FileAsset digitalAsset, String name)
			throws IOException
	{
		if (digitalAsset == null)
		{
			digitalAsset = new FileAsset();

			digitalAsset.setOrganization(org);
			digitalAsset = assetRepo.save(digitalAsset);

		}
		digitalAsset.setName(name);
		File destPath = new File(filesPath + File.separator + org.getId() + File.separator + digitalAsset.getId());
		Path path = destPath.toPath();
		if (!destPath.getParentFile().exists())
			Files.createDirectories(path);
		file.transferTo(destPath);
		return digitalAsset;
	}

	public Organization changeStatus(UUID id, Organization org, Authentication auth)
	{
		Organization existingOrg = orgRepo.findById(id).orElseThrow();
		existingOrg.setStatus(org.getStatus());
		existingOrg.setStatusReason(org.getStatusReason());
		return org;
	}

	public Page<Organization> getPageable(Specification<Organization> specs, Pageable page)
	{

		return orgRepo.findAll(specs, page);
	}

	public Page<Organization> search(Specification<Organization> specs, Authentication auth, Pageable page)
	{

		return orgRepo.findByOwner_username(auth.getName(), page);
	}

	public Organization changeStatus(UUID id, OrganizationStatus status, Authentication auth)
	{
		Organization org = orgRepo.findByIdAndOwner_username(id, auth.getName()).orElseThrow();
		if (org.getStatus() == OrganizationStatus.PENDING)
			org.setStatus(status);
		return org;
	}

	public Organization getById(UUID id, Authentication auth)
	{
		return orgRepo.findById(id).orElseThrow();
	}

	public Organization getByIdandUser(UUID id, Authentication auth)
	{
		return orgRepo.findByIdAndOwner_username(id, auth.getName().toLowerCase()).orElseThrow();
	}

	public List<Organization> getOrgByService(Authentication auth, Service service)
	{
		return orgRepo.findAllByServicesAndTypeAndStatus(service, OrganizationType.PARTNER, OrganizationStatus.ACTIVE);
	}

	public Organization addServiceToOrganization(Authentication auth, String serviceName)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName().toLowerCase()).orElseThrow();
		if (user.getDefaultOrg().getStatus().equals(OrganizationStatus.ACTIVE)
				&& user.getDefaultOrg().getType().equals(OrganizationType.PARTNER))
		{
			user.getDefaultOrg().getServices().add(serviceRepo.findByName(serviceName));
			return orgRepo.save(user.getDefaultOrg());

		}

		return null;
	}

	public Organization addServiceToOrganizationById(UUID id, String serviceName)
	{
		Organization org = orgRepo.findById(id).orElseThrow();
		if (org.getStatus().equals(OrganizationStatus.ACTIVE) && org.getType().equals(OrganizationType.PARTNER))
		{
			org.getServices().add(serviceRepo.findByName(serviceName));
			return orgRepo.save(org);

		}

		return null;
	}
}