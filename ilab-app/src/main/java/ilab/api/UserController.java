package ilab.api;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.PasswordResetToken;
import ilab.core.domain.User;
import ilab.core.service.UserService;
import ilab.dto.ChangePasswordDTO;
import ilab.utils.SendEmailEvent;

@RestController
@RequestMapping(path = "/api/users", produces = "application/json")
public class UserController
{
	@Autowired
	UserService userService;
	
	@Autowired
	private ApplicationEventPublisher eventPublisher;

	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public User postUser(@RequestBody User user)
	{
		User aUser = userService.register(user);
		eventPublisher.publishEvent(new SendEmailEvent(user.getEmail(), "iLab Account Activation", "activation-email.ftl", user));
		return aUser;
	}

	@GetMapping("/search")
//	@Secured("ROLE_ADMIN")
	public Page<User> getUsersPageable(@PageableDefault(value = 10, sort =
	{ "username" }) Pageable page, @SearchSpec Specification<User> specs)
	{
		return userService.getUsers(page, specs);
	}

	@PostMapping("/changePassword")
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
	public boolean savePassword(@RequestBody String newPassword)
	{
		userService.changePassword(newPassword);
		return true;
	}

	@GetMapping("/resetPassword")
	public RedirectView resetPassword(@RequestParam("id") UUID userId, @RequestParam("token") UUID token)
	{
		userService.resetPassword(userId, token);
		return new RedirectView("http://192.168.1.201/ui/reset-password");
	}

//	@GetMapping("/test")
//	public String test() throws Exception
//	{
//		Template t = freemarkerConfig.getTemplate("email-template.ftl");
//		Map<String, Object> model = new HashMap<String, Object>();
//		String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);
//		return html;
//	}
}
