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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.State;
import ilab.core.service.StateService;

@RestController
@RequestMapping(path = StateController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class StateController
{
	static final String REST_URL = "/api/state";
	@Autowired
	private StateService stateService;

	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public State create(@RequestBody State state, Authentication auth)
	{
		return stateService.create(state, auth);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void delete(@PathVariable("id") UUID id, Authentication auth)
	{
		stateService.delete(id, auth);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public State update( @RequestBody State state, Authentication auth)
	{

		return stateService.update(state, auth);
	}

	@GetMapping("/{id}")
	public State get(@PathVariable("id") UUID id, Authentication auth)
	{
		return stateService.get(id, auth);
	}		

	@GetMapping("search")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<State> getAll(@SearchSpec Specification<State> specs, Pageable page, Authentication auth)
	{
		return stateService.getPageable(specs, page);
	}

}
