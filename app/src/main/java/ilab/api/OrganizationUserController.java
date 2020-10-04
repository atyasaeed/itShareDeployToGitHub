package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationUser;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.service.OrganizationUserService;
import ilab.core.service.UserService;
import ilab.utils.exception.NotFoundException;

@RestController
@RequestMapping(path = OrganizationUserController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class OrganizationUserController
{

	static final String REST_URL = "/api/orguser";

	@Autowired
	private OrganizationUserService orgUserService;
	@Autowired
	private UserService userService;

	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public void create(@RequestBody String email, Authentication auth) throws Exception
	{

		orgUserService.addMemberToOrg(email, auth);

	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/accept/{id}")
	public OrganizationUser acceptInvitation(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{
		OrganizationUser orgUser = orgUserService.findbyId(id).orElseThrow();

		return orgUserService.acceptInvitation(orgUser, auth);
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/decline/{id}")
	public void declineInvitation(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{
		OrganizationUser orgUser = orgUserService.findbyId(id).orElseThrow();
		if (orgUser.getStatus() == Role.ROLE_INVITED)
		{
			orgUserService.deleteOrganizationUser(orgUser, auth);
		}
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/leave/{id}")
	public void leaveOrganization(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{
		OrganizationUser orgUser = orgUserService.findbyId(id).orElseThrow();
		if (orgUser.getStatus() == Role.ROLE_MEMBER)
		{
			orgUserService.deleteOrganizationUser(orgUser, auth);
		}
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("findAll")
	public Page<OrganizationUser> findAll(Specification<OrganizationUser> specs, Pageable page)
	{
		return orgUserService.findAll(specs, page);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("search/byuser")
	public Page<OrganizationUser> findbyUser(User user, Pageable page)
	{
		return orgUserService.findByUser(user, page);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("search/byorg")
	public Page<OrganizationUser> findbyOrg(Organization org, Pageable page)
	{
		return orgUserService.findByOrg(org, page);
	}

}
