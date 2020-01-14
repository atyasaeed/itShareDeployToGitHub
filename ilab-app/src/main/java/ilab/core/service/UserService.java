package ilab.core.service;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ilab.core.domain.Account;
import ilab.core.domain.Authority;
import ilab.core.domain.User;
import ilab.core.repository.UserRepository;

@Service
@Transactional(value = TxType.SUPPORTS)
public class UserService implements UserDetailsService
{
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private PasswordEncoder encoder;
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
	public User register(User user)
	{
		Authority authority=new Authority();
		authority.setAuthority("ROLE_USER");
		authority.setUser(user);
		user.getAuthorities().clear();
		user.addAuthority(authority);
		
		user.addAccount(new Account());
		user.setEnabled(true);
		user.setAccountNonExpired(true);
		user.setAccountNonLocked(true);
		user.setCredentialsNonExpired(true);
		user.setPassword(encoder.encode(user.getPassword()));
		return userRepo.save(user);
	}
}
