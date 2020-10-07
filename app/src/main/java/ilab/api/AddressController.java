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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.user.Address;
import ilab.core.domain.user.User;
import ilab.core.repository.AddressRepository;
import ilab.core.service.AddressService;

@RestController
@RequestMapping(path = AddressController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)

public class AddressController implements AbstractRestController<Address, UUID>

{
	static final String REST_URL = "/api/address";
	@Autowired
	AddressRepository addressRepo;
	@Autowired
	AddressService addressService;

	@Override
	@PreAuthorize("hasRole('ROLE_USER')")
	public Page<Address> getPageable(Pageable page, Specification<Address> specs, Authentication auth)
	{

		return addressRepo.findAll(filterByUser(auth.getName()).and(specs), page);

	}

	@Override
	@PreAuthorize("hasRole('ROLE_USER')")
	public Address create(Address entity, Authentication auth)
	{
		return addressService.save(entity, auth);
	}

	@Override
	@PreAuthorize("hasRole('ROLE_USER')")
	public void delete(UUID id, Authentication auth)
	{
		addressService.remove(id, auth);

	}

	@Override
	@PreAuthorize("hasRole('ROLE_USER')")
	public Address get(UUID id, Authentication authentication)
	{

		return addressService.findUserAddress(id, authentication);
	}

	@Override
	@PreAuthorize("hasRole('ROLE_USER')")
	public Address update(Address entity, Authentication auth)
	{

		return addressService.update(entity, auth);
	}

	private Specification<Address> filterByUser(String username)
	{
		return (Root<Address> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			Path<User> userPath = root.<User>get("user");
			predicates.add(cb.equal(userPath.<UUID>get("username"), username));
			return cb.and(predicates.toArray(new Predicate[predicates.size()]));
		};
	}
}
