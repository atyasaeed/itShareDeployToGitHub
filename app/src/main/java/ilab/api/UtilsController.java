package ilab.api;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.user.User;
import ilab.core.repository.ServiceRepository;
import ilab.core.service.OrderService;
import ilab.core.service.UserService;
import ilab.dto.InitStateDTO;


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

	@GetMapping("/initState")
	public InitStateDTO getInitState(Authentication auth,Locale locale)
	{
		InitStateDTO initState = new InitStateDTO();
		initState.setServices(serviceRepository.findAll());
		if (auth != null)
		{
			UserDetails userDetails = (UserDetails) auth.getPrincipal();
			Map<String, Object> userData = new HashMap<>();
			User user=userService.findUser(auth);
			userData.put("username", userDetails.getUsername());
			userData.put("roles", userDetails.getAuthorities().stream().map(authority -> authority.getAuthority()).toArray());
			userData.put("defaultOrgType", user.getDefaultOrg().getType());
			userData.put("defaultOrgStatus", user.getDefaultOrg().getStatus());
			initState.setUser(userData);
			initState.setShoppingCart(orderService.getShoppingCart(auth));
			
		}
		initState.setLang(locale.getLanguage());
		return initState;
	}
	@PutMapping("lang")
	public InitStateDTO updateLang(Authentication auth,Locale locale)
	{
		InitStateDTO appState = new InitStateDTO();
		appState.setLang(locale.getLanguage());
		return appState;
	}
}
