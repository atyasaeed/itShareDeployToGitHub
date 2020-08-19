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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.Reason;
import ilab.core.domain.ReasonStatus;
import ilab.core.repository.ReasonRepository;
import ilab.core.service.ReasonService;

@RestController
@RequestMapping(path = ReasonController.REST_URL,produces = MediaType.APPLICATION_JSON_VALUE)

public class ReasonController implements AbstractRestController<Reason, UUID>
{
	static final String REST_URL = "/api/reason";
	@Autowired
	private ReasonService service;
	@Autowired
	private ReasonRepository repo;
	@Override
	public Page<Reason> getPageable(Pageable page, Specification<Reason> specs, Authentication auth)
	{
		
		return repo.findAll(filterByStatus(ReasonStatus.PUBLISHED).and(specs), page);
	}
	@GetMapping("search/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<Reason> search(Pageable page, @SearchSpec Specification<Reason> specs, Authentication auth)
	{
		return repo.findAll(specs,page);
	}
	public Specification<Reason> filterByStatus(ReasonStatus status)
	{
		return (Root<Reason> root, CriteriaQuery<?> query, CriteriaBuilder cb) ->
		{
			List<Predicate> predicates = new ArrayList<>();

			predicates.add(cb.equal(root.<ReasonStatus>get("status"), status));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Reason create(Reason entity, Authentication auth)
	{
		return service.create(entity);
	}

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Reason update(Reason entity, Authentication auth)
	{
		return service.update(entity);
	}

	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void delete(UUID id, Authentication authentication)
	{
		service.delete(id);
		
	}

	@Override
	public Reason get(UUID id, Authentication authentication)
	{
		return repo.findById(id).orElseThrow();
	}
}
