package ilab.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import ilab.core.domain.User;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler
{


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException
	{
		response.setStatus(HttpStatus.OK.value());
		response.setHeader("content-type", "application/json");
		Map<String, Object> data = new HashMap<>();
//		response.getOutputStream().println(authentication);
		UserDetails user=(UserDetails)authentication.getPrincipal();
		response.getOutputStream().println(String.format("{\"name\":\"%s\"}", user.getUsername()));
//		response.getOutputStream().println("Hello");
		
	}
}