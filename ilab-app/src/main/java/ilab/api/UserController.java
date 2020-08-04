package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.PasswordResetToken;
import ilab.core.domain.User;
import ilab.core.service.UserService;
import ilab.dto.ChangePasswordDTO;
import ilab.utils.SendEmailEvent;
import ilab.utils.exception.NotFoundException;

@RestController
@RequestMapping(path = UserController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController
{
	static final String REST_URL="/api/user";
	
	@Value("${iLab.urls.resetPassword}")
	String resetPasswordUrl;
	@Value("${iLab.urls.selfProvisionResult}")
	String selfProvisionResultUrl;
	@Autowired
	UserService userService;
	
	@Autowired
	private ApplicationEventPublisher eventPublisher;

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public User postUser(@RequestBody User user)
	{
		User aUser;
		try
		{
			aUser = userService.register(user);
		} catch (DataIntegrityViolationException e)
		{
			throw e;
		}
		eventPublisher.publishEvent(
				new SendEmailEvent(user.getEmail(), "iLab Account Activation", "activation-email.ftl", user));
		return aUser;
	}

	
	@PostMapping("/changePassword")
	@PreAuthorize("hasRole('ROLE_USER')")
	public boolean changePassword(Authentication auth, @RequestBody ChangePasswordDTO dto)
	{
		dto.setUsername(auth.getName());
		userService.changePassword(dto);
		return true;
	}

	@PostMapping("/resetPassword")
	public boolean resetPassword(@RequestBody String email)
	{
		PasswordResetToken token=userService.resetPassword(email);
		eventPublisher.publishEvent(new SendEmailEvent(token.getUser().getEmail(), "iLab Account Reset Password", "resetPassword-email.ftl", token));

		return true;
	}

	@PostMapping("/savePassword")
	public boolean savePassword(@RequestBody String newPassword,Authentication auth)
	{
		userService.changePassword(newPassword);
		return true;
	}

	@GetMapping("/resetPassword")
	public RedirectView resetPassword(@RequestParam("id") UUID userId, @RequestParam("token") UUID token)
	{
		userService.resetPassword(userId, token);
		return new RedirectView(resetPasswordUrl);
	}
	@GetMapping
	@PreAuthorize("hasRole('ROLE_USER')")
	public User getUser(Authentication auth)
	{
		return userService.findUser(auth);
	}
	
	@PutMapping
	@PreAuthorize("hasRole('ROLE_USER')")
	public User updateUser(@RequestBody User user,Authentication auth)
	{
		return userService.update(user, auth);
	}
	@GetMapping("selfProvision")
	public RedirectView provisionUser(@RequestParam("id") UUID userId, @RequestParam("token") UUID token)
	{
		userService.enableUser(userId, true, null);
		return new RedirectView(selfProvisionResultUrl);
	}

	@GetMapping("search")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Page<User> getUsersPageable(@PageableDefault(value = 10, sort =
	{ "username" }) Pageable page, @SearchSpec Specification<User> specs)
	{
		return userService.getUsers(page, specs);
	}
	@PutMapping(path = "/{id}/enable")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public User enable(@PathVariable("id") UUID id,Authentication auth)
	{
		return userService.enableUser(id, true,auth);
	}
	@PutMapping(path = "/{id}/unblock")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public User unblock(@PathVariable("id") UUID id,Authentication auth)
	{
		return userService.setUserNonBlocked(id, true,auth);

	}
	@GetMapping(path = "/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public User getUser(@PathVariable("id") UUID id)
	{
		return userService.findUser(id).orElseThrow(()->new NotFoundException("User Not Found"));
	}
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/admin")
	public User update(@RequestBody User user,Authentication auth)
	{
		return userService.update(user);
	}
}
