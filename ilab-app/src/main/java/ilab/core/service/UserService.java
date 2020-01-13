package ilab.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ilab.core.domain.User;
import ilab.core.repository.UserRepository;

@Service
public class UserService implements UserDetailsService
{
	@Autowired
	private UserRepository userRepo;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
	{
		User user=userRepo.findByUsername(username);
		UserBuilder userBuilder=null;
		if(user!=null) 
		{
			userBuilder=org.springframework.security.core.userdetails.User.withUsername(username);
			userBuilder.disabled(!user.isEnabled());
			userBuilder.password(user.getPassword());
			String[] authorities=user.getAuthorities().stream().map(a->a.getAuthority()).toArray(String[]::new);
			userBuilder.authorities(authorities);
			UserDetails userDetails=userBuilder.build();
			return userDetails;
		}
		throw new UsernameNotFoundException(String.format("User '%s' not found!", username));
	}

}
