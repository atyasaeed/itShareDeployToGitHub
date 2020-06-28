package ilab.api.admin;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.User;
import ilab.core.service.UserService;
import ilab.utils.exception.NotFoundException;

@RestController
@RequestMapping(path = "/api/admin/users", produces = "application/json")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminUserController
{
	@Autowired
	UserService userService;
	
	@GetMapping("search")
	public Page<User> getUsersPageable(@PageableDefault(value = 10, sort =
	{ "username" }) Pageable page, @SearchSpec Specification<User> specs)
	{
		return userService.getUsers(page, specs);
	}
	@PutMapping(path = "/{id}/enable")
	public User enable(@PathVariable("id") UUID id,Authentication auth)
	{
		return userService.enableUser(id, true,auth);
	}
	@PutMapping(path = "/{id}/unblock")
	public User unblock(@PathVariable("id") UUID id,Authentication auth)
	{
		return userService.setUserNonBlocked(id, true,auth);

	}
	@GetMapping(path = "/{id}")
	public User getUser(@PathVariable("id") UUID id)
	{
		return userService.findUser(id).orElseThrow(()->new NotFoundException("User Not Found"));
	}
}

