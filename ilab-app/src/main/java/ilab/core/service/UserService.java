package ilab.core.service;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import ilab.core.domain.Account;
import ilab.core.domain.Authority;
import ilab.core.domain.PasswordResetToken;
import ilab.core.domain.User;
import ilab.core.repository.PasswordTokenRepository;
import ilab.core.repository.UserRepository;
import ilab.dto.ChangePasswordDTO;

@Service
@Transactional
public class UserService implements UserDetailsService
{
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private PasswordTokenRepository passwordTokenRepo;
	@Autowired
	private EmailService emailService;
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
	public Page<User> getUsers(Pageable page,Specification<User> specs)
	{
		return userRepo.findAll(specs,page);
	} 
	public void changePassword(ChangePasswordDTO dto)
	{
		User user=userRepo.findByUsername(dto.getUsername());
		
		
		if(!encoder.matches(dto.getOldPassword(), user.getPassword()))
		{
			throw new ResponseStatusException(HttpStatus.CONFLICT,"Invalid Old Password");
		}
		user.setPassword(encoder.encode(dto.getNewPassword()));
	}
	public void changePassword(String password)
	{
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		user.setPassword(encoder.encode(password));
		userRepo.save(user);
		SecurityContextHolder.getContext().setAuthentication(null);
	}
	public PasswordResetToken resetPassword(String email)
	{
		User user=userRepo.findByemail(email);
		if(user==null)
			throw new UsernameNotFoundException("Username is not here");
		PasswordResetToken myToken = passwordTokenRepo.findByUserAndUsedFalse(user);
		if(myToken==null)
		{
			myToken = new PasswordResetToken();
			myToken.setUser(user);
			
		}
		myToken.setSent(false);
		myToken.setExpiryDate(new Date(System.currentTimeMillis()+(24*60*60*1000)));
	    return passwordTokenRepo.save(myToken);
		
	}
	public void resetPassword(UUID userId,UUID token)
	{
		Optional<PasswordResetToken> resetToken=passwordTokenRepo.findById(token);
		if(resetToken.isPresent() && resetToken.get().getUser().getId().equals(userId) )
		{
			User user=resetToken.get().getUser();
//			user.setPassword(encoder.encode("hello@123456"));
			resetToken.get().setUsed(true);
//			userRepo.save(user);
//			passwordTokenRepo.delete(resetToken.get());
			Authentication auth =new UsernamePasswordAuthenticationToken(user, null, Arrays.asList(
				      new SimpleGrantedAuthority("CHANGE_PASSWORD_PRIVILEGE")));
			SecurityContextHolder.getContext().setAuthentication(auth);
			return;
		}
			
		throw new ResponseStatusException(HttpStatus.CONFLICT,"Invalid Reset Password Token");
		
	}
	
}
