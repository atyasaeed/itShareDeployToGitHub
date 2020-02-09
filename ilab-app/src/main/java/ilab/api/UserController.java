package ilab.api;

import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.User;
import ilab.core.service.UserService;

@RestController
@RequestMapping(path = "/api/users",produces = "application/json")
public class UserController
{
	@Autowired
	UserService userService;
	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public User postUser(@RequestBody User	user)
	{
		User aUser= userService.register(user);
		return aUser;
	}
	@GetMapping()
//	@Secured("ROLE_ADMIN")
	public Page<User> getUsersPageable(@PageableDefault(value=10,sort = {"username"}) Pageable page )
	{
		return userService.getUsers(page);
	}

}
