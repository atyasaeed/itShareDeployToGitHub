package ilab.api;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.City;
import ilab.core.domain.State;
import ilab.core.service.CityService;

@RestController
@RequestMapping(path = CityController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class CityController
{
	static final String REST_URL = "/api/city";
	@Autowired
	private CityService cityService;

	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public City create(@RequestBody City city, Authentication auth)
	{
		return cityService.create(city, auth);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void delete(@PathVariable("id") UUID id, Authentication auth)
	{
		cityService.delete(id, auth);
	}

	@PutMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public City update(@RequestBody City city, Authentication auth)
	{
		return cityService.create(city, auth);
	}

	@GetMapping("/{id}")
	public City findById(@PathVariable("id") UUID id, Authentication auth)
	{
		return cityService.findById(id, auth);
	}

	@GetMapping("search")
	@PreAuthorize("permitAll()")
	public Page<City> findAll(Pageable page, Authentication auth, @SearchSpec Specification<City> specs,
			@RequestParam(name = "stateId", required = false) UUID stateId)
	{
		if (stateId != null)
		{
			specs = filterByStateId(stateId).and(specs);
		}
		return cityService.findAll(specs, page, auth);
	}

	private Specification<City> filterByStateId(UUID value)
	{
		return (Root<City> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			Path<State> statePath = root.<State>get("state");
			predicates.add(cb.equal(statePath.<UUID>get("id"), value));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
