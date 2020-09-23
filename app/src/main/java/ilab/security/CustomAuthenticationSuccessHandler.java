package ilab.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import ilab.core.domain.user.User;
import ilab.core.service.UserService;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler
{
	@Autowired
	UserService userService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException
	{
		ObjectMapper objectMapper = new ObjectMapper();
		response.setStatus(HttpStatus.OK.value());
		response.setHeader("content-type", MediaType.APPLICATION_JSON_VALUE);
		//TODO: to enhnace performance
		User user=userService.findUser(authentication);
		UserDetails userDetails=(UserDetails)authentication.getPrincipal();
		Map<String, Object> data = new HashMap<>();
		data.put("username",userDetails.getUsername());
		data.put("roles",userDetails.getAuthorities().stream().map(authority->authority.getAuthority()).toArray());
		data.put("defaultOrgType", user.getDefaultOrg().getType());

		
		response.getOutputStream().println(objectMapper.writeValueAsString(data));
		
		
		
		
		
	}
}