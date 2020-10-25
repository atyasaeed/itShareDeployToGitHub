package ilab.api;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.user.PasswordResetToken;
import ilab.core.domain.user.User;
import ilab.core.service.UserService;
import ilab.dto.ChangePasswordDTO;
import ilab.utils.exception.NotFoundException;

@RestController
@RequestMapping(path = UserController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController
{
	static final String REST_URL = "/api/user";

	@Value("${iLab.urls.resetPassword}")
	String resetPasswordUrl;
	@Value("${iLab.urls.home}")
	String homeUrl;

	@Autowired
	UserService userService;

	@Autowired
	private ApplicationEventPublisher eventPublisher;

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public User register(@RequestBody User user)
	{
		user.setUsername(user.getEmail());
		user = userService.register(user);
		return user;
	}

	@PutMapping("activate")
	@PreAuthorize("hasAnyRole('ROLE_ANONYMOUS')")
	public Map<String, Object> activateUser(@RequestPart("user") User user,
			@RequestPart("activationCode") String activationCode, Authentication auth) throws Exception
	{
		return userService.activate(user, activationCode, auth);
	}

	@GetMapping("activate")
	@PreAuthorize("hasAnyRole('ROLE_ANONYMOUS')")
	public RedirectView activateUser(@RequestParam("id") UUID id, @RequestParam("activationCode") String activationCode)
			throws Exception
	{
		userService.activate(id, activationCode);
		return new RedirectView(homeUrl);
	}

	@PostMapping("/changePassword")
	@PreAuthorize("isAuthenticated()")
	public boolean changePassword(Authentication auth, @RequestBody ChangePasswordDTO dto)
	{
		dto.setUsername(auth.getName());
		userService.changePassword(dto);
		return true;
	}

	@PostMapping("resetPassword")
	@PreAuthorize("isAnonymous()")
	public boolean resetPassword(@RequestBody String email)
	{
		PasswordResetToken token = userService.resetPassword(email);

		return true;
	}

	@PostMapping("savePassword")

	public boolean savePassword(@RequestBody String newPassword, Authentication auth)
	{
		userService.changePassword(newPassword);
		return true;
	}

	@GetMapping("resetPassword")
	public RedirectView resetPassword(@RequestParam("id") UUID userId, @RequestParam("token") UUID token)
	{
		userService.resetPassword(userId, token);
		return new RedirectView(resetPasswordUrl);
	}

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public User getUser(Authentication auth)
	{
		return userService.findUser(auth);
	}

	@PutMapping
	@PreAuthorize("isAuthenticated()")
	public User updateUser(@RequestBody User user, Authentication auth)
	{
		return userService.update(user, auth);
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
	public User enable(@PathVariable("id") UUID id, Authentication auth)
	{
		return userService.enableUser(id, true, auth);
	}

	@PutMapping(path = "/{id}/unblock")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public User unblock(@PathVariable("id") UUID id, Authentication auth)
	{
		return userService.setUserNonBlocked(id, true, auth);

	}

	@GetMapping(path = "/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public User getUser(@PathVariable("id") UUID id)
	{
		return userService.findUser(id).orElseThrow(() -> new NotFoundException("User Not Found"));
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/admin")
	public User update(@RequestBody User user, Authentication auth)
	{
		return userService.update(user);
	}

	@GetMapping("resendProvision")
	public boolean resendProvisionCode(@RequestParam("username") String username)
	{
		return userService.resendActivationCode(username);
	}

}
