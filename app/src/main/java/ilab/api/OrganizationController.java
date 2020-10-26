package ilab.api;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.service.OrganizationService;

@RestController
@RequestMapping(path = OrganizationController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)

public class OrganizationController
{
	static final String REST_URL = "/api/organization";
	@Autowired
	private OrganizationService orgService;

	@PutMapping(path = "/{id}")
	@PreAuthorize("hasAnyRole('ROLE_USER','ROLE_REGISTER_PRIVILEGE')")
	public Organization updateOrgInfo(@PathVariable("id") UUID id,
			@RequestPart(name = "org", required = false) Organization org,
			@RequestPart(name = "file1", required = false) MultipartFile file1,
			@RequestPart(name = "file2", required = false) MultipartFile file2,
			@RequestPart(name = "file3", required = false) MultipartFile file3,
			@RequestPart(name = "file4", required = false) MultipartFile file4, Authentication auth) throws IOException
	{
		return orgService.updateOrganization(id, org, file1, file2, file3, file4, auth);
	}

	@PutMapping("/{id}/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Organization changeStatus(@PathVariable("id") UUID id, @RequestBody Organization org, Authentication auth)
	{
		return orgService.changeStatus(id, org, auth);
	}

	@PutMapping("/{id}/requestApproval")
	@PreAuthorize("isAuthenticated()")
	public Organization requestApproval(@PathVariable("id") UUID id, Authentication auth)
	{
		return orgService.changeStatus(id, OrganizationStatus.WAITING_APPROVAL, auth);
	}

	@GetMapping("search/partners")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<Organization> getPageable(Pageable page, @SearchSpec Specification<Organization> specs,
			Authentication auth, @RequestParam(value = "status", required = false) List<OrganizationStatus> status)
	{
		specs = new Specification<Organization>()
		{

			@Override
			public Predicate toPredicate(Root<Organization> root, CriteriaQuery<?> query,
					CriteriaBuilder criteriaBuilder)
			{
				return root.get("type").in(Arrays.asList(OrganizationType.PARTNER));
			}
		}.and(specs);

		if (status != null && status.size() > 0)
			specs = (filterByStatus(status).and(specs));

		return orgService.getPageable(specs, page);

	}

	private Specification<Organization> filterByStatus(List<OrganizationStatus> status)
	{
		// TODO Auto-generated method stub
		return (Root<Organization> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();
			predicates.add(root.get("status").in(status));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}

	@GetMapping("search")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<Organization> search(Pageable page, @SearchSpec Specification<Organization> specs, Authentication auth)
	{

		return orgService.search(specs, auth, page);

	}

	@GetMapping("admin/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Organization get(Authentication auth, @PathVariable("id") UUID id)
	{
		return orgService.getById(id, auth);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Organization getAdmin(Authentication auth, @PathVariable("id") UUID id)
	{
		return orgService.getByIdandUser(id, auth);
	}



}