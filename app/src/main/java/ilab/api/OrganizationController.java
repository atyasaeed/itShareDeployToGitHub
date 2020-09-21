package ilab.api;

import java.util.ArrayList;
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
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.Reason;
import ilab.core.domain.ReasonStatus;
import ilab.core.domain.user.Organization;
import ilab.core.repository.ReasonRepository;
import ilab.core.service.ReasonService;

@RestController
@RequestMapping(path = OrganizationController.REST_URL,produces = MediaType.APPLICATION_JSON_VALUE)

public class OrganizationController
{
	static final String REST_URL = "/api/organization";
	
	@PutMapping(path="/{id}")
	@PreAuthorize("hasRole('ROLE_USER')")
	public Organization updateOrgInfo(@PathVariable("id") UUID id, 
			@RequestPart(name="org",required = false) Organization org,
			@RequestPart(name="file1",required = false) FilePart file1,
			@RequestPart(name="file2",required = false) FilePart file2,
			@RequestPart(name="file3",required = false) FilePart file3,
			@RequestPart(name="file4",required = false) FilePart file4,
			Authentication auth)
	{
		return null;
	}
	

}
