package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.user.OrganizationUser;
import ilab.core.service.OrganizationUserService;

@RestController
@RequestMapping(path = OrganizationUserController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class OrganizationUserController
{

	static final String REST_URL = "/api/orguser";

	@Autowired
	private OrganizationUserService orgUserService;

	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public void create(@RequestBody String email, Authentication auth) throws Exception
	{

		orgUserService.addMemberToOrg(email, auth);

	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("/accept/{id}")
	public OrganizationUser acceptInvitation(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{

		return orgUserService.acceptInvitation(id, auth);
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("/{id}")
	public void declineInvitation(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{
		orgUserService.deleteOrganizationUser(id, auth);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("search/user")
	public Page<OrganizationUser> findbyUser(Authentication auth, Pageable page)
	{
		return orgUserService.findByUser(auth, page);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("search/org")
	public Page<OrganizationUser> findbyOrg(Authentication auth, Pageable page)
	{
		return orgUserService.findByOrg(auth, page);
	}

	@GetMapping(path = "/{id}")
	public OrganizationUser get(@PathVariable("id") UUID id, Authentication authentication)
	{
		return null;
	}
}
