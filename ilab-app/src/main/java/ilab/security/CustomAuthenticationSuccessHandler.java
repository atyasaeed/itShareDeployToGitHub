package ilab.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler
{


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException
	{
		ObjectMapper objectMapper = new ObjectMapper();
		response.setStatus(HttpStatus.OK.value());
		response.setHeader("content-type", MediaType.APPLICATION_JSON_VALUE);
		UserDetails user=(UserDetails)authentication.getPrincipal();
		Map<String, Object> data = new HashMap<>();
		data.put("username",user.getUsername());
		data.put("roles",user.getAuthorities().stream().map(authority->authority.getAuthority()).toArray());
//		response.getOutputStream().println(authentication);
		response.getOutputStream().println(objectMapper.writeValueAsString(data));
//		response.getOutputStream().println("Hello");
		
		
		
		
		
	}
}