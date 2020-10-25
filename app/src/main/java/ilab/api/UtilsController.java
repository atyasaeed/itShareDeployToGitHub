package ilab.api;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.ServiceRepository;
import ilab.core.repository.UserRepository;
import ilab.core.service.OrderService;
import ilab.core.service.UserService;
import ilab.dto.InitStateDTO;
import ilab.utils.CSVHelper;

@RestController
@RequestMapping(path = UtilsController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class UtilsController
{
	static final String REST_URL = "/api/utils";

	@Autowired
	private OrderService orderService;
	@Autowired
	private ServiceRepository serviceRepository;
	@Autowired
	UserService userService;
	@Autowired
	UserRepository userRepo;

	@GetMapping("/initState")
	public InitStateDTO getInitState(Authentication auth, Locale locale)
	{
		InitStateDTO initState = new InitStateDTO();
		initState.setServices(serviceRepository.findAll());
		if (auth != null)
		{
			UserDetails userDetails = (UserDetails) auth.getPrincipal();
			Map<String, Object> userData = new HashMap<>();
			User user = userService.findUser(auth);
			userData.put("username", userDetails.getUsername());
			userData.put("roles",
					userDetails.getAuthorities().stream().map(authority -> authority.getAuthority()).toArray());
			userData.put("defaultOrgType", user.getDefaultOrg().getType());
			userData.put("defaultOrgStatus", user.getDefaultOrg().getStatus());
			initState.setUser(userData);
			initState.setShoppingCart(orderService.getShoppingCart(auth));

		}
		initState.setLang(locale.getLanguage());
		return initState;
	}

	@PutMapping("lang")
	public InitStateDTO updateLang(Authentication auth, Locale locale)
	{
		InitStateDTO appState = new InitStateDTO();
		appState.setLang(locale.getLanguage());
		return appState;
	}

	@PostMapping("/importUsers")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public HashMap<String, Boolean> addBulkUser(@RequestParam("file") MultipartFile usersFile, Authentication auth)
			throws Exception
	{
		List<User> users = CSVHelper.csvToUsers(usersFile.getInputStream());
		HashMap<String, Boolean> map = new HashMap<String, Boolean>();

		for (User user : users)
		{
			try
			{
				System.out.println("Start Register");
				user = userService.register(user);
				System.out.println("Registeration finished");
				user = userService.enableUser(user.getId(), true, null);
				user.addRole(Role.ROLE_USER);
				userRepo.save(user);

				System.out.println("User Enabled");
				map.put(user.getEmail(), true);
				System.out.print(user.toString());
			} catch (Exception e)
			{
				map.put(user.getEmail(), false);
			}
		}
		return map;
	}
}
