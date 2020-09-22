package ilab.api;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.user.Organization;
import ilab.core.service.OrganizationService;

@RestController
@RequestMapping(path = OrganizationController.REST_URL,produces = MediaType.APPLICATION_JSON_VALUE)

public class OrganizationController
{
	static final String REST_URL = "/api/organization";
	@Autowired
	private OrganizationService orgService;
	
	@PutMapping(path="/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Organization updateOrgInfo(@PathVariable("id") UUID id, 
			@RequestPart(name="org",required = false) Organization org,
			@RequestPart(name="file1",required = false) MultipartFile file1,
			@RequestPart(name="file2",required = false) MultipartFile file2,
			@RequestPart(name="file3",required = false) MultipartFile file3,
			@RequestPart(name="file4",required = false) MultipartFile file4,
			Authentication auth) throws IOException
	{
		return orgService.updateOrganization(id, org, file1, file2, file3, file4, auth);
	}
	
	@PutMapping("/{id}/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Organization changeStatus(@PathVariable("id") UUID id,@RequestBody Organization org,Authentication auth)
	{
		return orgService.changeStatus(id,org,auth);
	}
	
	
}
