package ilab.core.service;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.jms.core.JmsTemplate;
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

import ilab.core.domain.user.ActivationCode;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.PasswordResetToken;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.ActivationCodeRepository;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.PasswordTokenRepository;
import ilab.core.repository.UserRepository;
import ilab.dto.ChangePasswordDTO;
import ilab.utils.exception.IllegalRequestDataException;
import ilab.utils.exception.NotFoundException;

@Service
@Transactional
public class UserService implements UserDetailsService
{
	@Value("${iLab.queues.activationCode}")
	private String activationCodeQueue;
	@Value("${iLab.queues.passwordToken}")
	private String passwordTokenQueue;

	@Value("${ilab.queues.welcome}")
	private String welcomeQueue;
	
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private PasswordTokenRepository passwordTokenRepo;
	@Autowired
	private PasswordEncoder encoder;
	@Autowired
	private EmailService emailService;
	@Autowired
	private JmsTemplate jmsTemplate;
	@Autowired
	private ActivationCodeRepository activationCodeRepo;
	@Autowired
	private OrganizationRepository orgRepo;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
	{
		User user=userRepo.findByUsernameIgnoreCase(username).orElseThrow(()->new UsernameNotFoundException(""));
		UserBuilder userBuilder=null;
		userBuilder=org.springframework.security.core.userdetails.User.withUsername(username);
		userBuilder.disabled(!user.isEnabled());
		userBuilder.password(user.getPassword());
		String[] authorities=user.getRoles().stream().map(a->a.getAuthority()).toArray(String[]::new);
		userBuilder.authorities(authorities);
		UserDetails userDetails=userBuilder.build();
		return userDetails;
	}
	public User register(User user)
	{
	
		user.getRoles().clear();
		
		user.setEnabled(false);
		user.setAccountNonExpired(true);
		user.setAccountNonLocked(true);
		user.setCredentialsNonExpired(true);
		user.setPassword(encoder.encode(user.getPassword()));
		ActivationCode activationCode = new ActivationCode();
		if (userRepo.existsByUsername(user.getEmail()))
		{
			User existUser = userRepo.findByUsernameIgnoreCase(user.getEmail()).get();
			if (!existUser.isEnabled())
			{
				activationCode = activationCodeRepo.findByUser_UsernameIgnoreCaseAndUsedFalse(user.getEmail())
						.orElse(null);
				activationCode.setSent(false);
				existUser.setPassword(user.getPassword());
				existUser.setFirstName(user.getFirstName());
				existUser.setLastName(user.getLastName());
				existUser.setMiddleName(user.getMiddleName());
				existUser.setMobileNo(user.getMobileNo());
				user = existUser;
			}
		}
		if(user.getDefaultOrg()==null)
		{
			Organization org=new Organization();
			org.setAddress("address");
			org.setCity("city");
			org.setMobileNo(user.getMobileNo());
			org.setName(user.getFirstName());
			org.setType(OrganizationType.INDIVIDUAL);
			user.setDefaultOrg(org);
		}
		user.getDefaultOrg().setOwner(user);
		user=userRepo.save(user);
		activationCode.setUser(user);
		switch(user.getDefaultOrg().getType())
		{
		case INDIVIDUAL:
			user.getDefaultOrg().setStatus(OrganizationStatus.ACTIVE);
			break;
		case PARTNER:
			user.getDefaultOrg().setStatus(OrganizationStatus.PENDING);
		}
		activationCode.setCode(String.format("%06d", new Random().nextInt(999999)));
		activationCode.setLocale(LocaleContextHolder.getLocale());
		activationCode = activationCodeRepo.save(activationCode);

		jmsTemplate.convertAndSend(activationCodeQueue, activationCode.getId());
		return user;
		
	}
	public Page<User> getUsers(Pageable page,Specification<User> specs)
	{
		return userRepo.findAll(specs,page);
	} 
	public void changePassword(ChangePasswordDTO dto)
	{
		User user=userRepo.findByUsernameIgnoreCase(dto.getUsername()).orElseThrow();
		
		
		if(!encoder.matches(dto.getOldPassword(), user.getPassword()))
		{
			throw new ResponseStatusException(HttpStatus.CONFLICT,"Invalid Old Password");
		}
		user.setPassword(encoder.encode(dto.getNewPassword()));
	}
	public void changePassword(String password)
	{
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User user=userRepo.findByemailIgnoreCase(userDetails.getUsername()).orElseThrow();
		user.setPassword(encoder.encode(password));
		userRepo.save(user);
		SecurityContextHolder.getContext().setAuthentication(null);
	}
	public PasswordResetToken resetPassword(String email)
	{
		User user = userRepo.findByemailIgnoreCase(email)
				.orElseThrow(() -> new UsernameNotFoundException("Username is not here"));
		validateUserForAction(user);
		PasswordResetToken token = passwordTokenRepo.findByUserAndUsedFalse(user);
		if (token == null)
		{
			token = new PasswordResetToken();
			token.setUser(user);

		}
		token.setSent(false);
		token.setExpiryDate(new Date(System.currentTimeMillis() + (24 * 60 * 60 * 1000)));
		token.setLocale(LocaleContextHolder.getLocale());
		token = passwordTokenRepo.save(token);
		jmsTemplate.convertAndSend(passwordTokenQueue, token.getId());
		return token;
	}
	private void validateUserForAction(User user)
	{
		if (user.isAccountNonExpired() && user.isAccountNonLocked())
		{
			return;
		}
		throw new IllegalRequestDataException("User can't reset password because it is not active");
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
			Authentication auth =new UsernamePasswordAuthenticationToken(loadUserByUsername(user.getUsername()), null, Arrays.asList(
				      new SimpleGrantedAuthority("CHANGE_PASSWORD_PRIVILEGE")));
			SecurityContextHolder.getContext().setAuthentication(auth);
			return;
		}
			
		throw new ResponseStatusException(HttpStatus.CONFLICT,"Invalid Reset Password Token");
		
	}
	public User findUser(Authentication auth)
	{
		return userRepo.findByUsernameIgnoreCase(auth.getName()).orElseThrow();
	}
	public Optional<User> findUser(UUID id)
	{
		return userRepo.findById(id);
	}
	public User update(User user,Authentication auth)
	{
		User theUser=findUser(auth);
		theUser.setFirstName(user.getFirstName());
		theUser.setLastName(user.getLastName());
		return theUser;
	}
	public User update(User user)
	{
		User existUser=findUser(user.getId()).orElseThrow();
		existUser.setEmail(user.getEmail());
		existUser.setFirstName(user.getFirstName());
		existUser.setLastName(user.getLastName());
		existUser.setMobileNo(user.getMobileNo());
		return existUser;
	}
	public User enableUser(UUID userId,boolean isEnabled,Authentication auth)
	{
		User user = userRepo.findById(userId).orElseThrow();
		if (!isEnabled && user.getUsername().equals(auth.getName()))
			throw new IllegalRequestDataException("Can't disable the current logged user");
		user.setEnabled(isEnabled);
		return user;
	}

	public User setUserNonBlocked(UUID userId,boolean isNonBlocked,Authentication auth)
	{
		User user = userRepo.findById(userId).orElseThrow(() -> new NotFoundException("User Not Found"));
		if(user.getUsername().equals(auth.getName()))
			throw new IllegalRequestDataException("Can't block the current logged user");

		user.setAccountNonLocked(isNonBlocked);
		return user;
	}
	
	public Map<String,Object> activate(User user, String activationCode,Authentication auth) throws Exception
	{
		ActivationCode code = activationCodeRepo.findByUser_UsernameIgnoreCaseAndUsedFalse(user.getUsername())
				.orElseThrow();
		user=code.getUser();
		Map<String, Object> results=new HashMap<String, Object>();
		if ( code.getCode().equals(activationCode) && !code.isUsed())
		{
			code.setUsed(true);
			user.setEnabled(true);
			
			code.getUser().addRole(Role.ROLE_USER);
			jmsTemplate.convertAndSend(welcomeQueue, code.getUser().getId());
			results.putAll(Map.of("roles",user.getRoles(),"defaultOrg",user.getDefaultOrg()));
			if(auth==null&&user.getDefaultOrg().getType()==OrganizationType.PARTNER)
			{
				auth = new UsernamePasswordAuthenticationToken(loadUserByUsername(user.getUsername()), null,
					Arrays.asList(Role.ROLE_REGISTER_PRIVILEGE));
				SecurityContextHolder.getContext().setAuthentication(auth);
			}

		}
		results.put("status",user.isEnabled());
		return results;
	}
	public Map<String,Object> activate(UUID userId, String activationCode)
	{
		ActivationCode code = activationCodeRepo.findByUser_Id(userId).orElseThrow();
		User user=code.getUser();
		if (code.getCode().equals(activationCode) && !code.isUsed())
		{
			code.setUsed(true);
			
			user.setEnabled(true);
			code.getUser().addRole(Role.ROLE_USER);
			jmsTemplate.convertAndSend(welcomeQueue, code.getUser().getId());

		}

		return Map.of("status",user.isEnabled(),"roles",user.getRoles(),"defaultOrg",user.getDefaultOrg());

	}
	public void sendWelcomeMsg(UUID userId) throws Exception
	{
		User user = userRepo.findById(userId).orElse(null);

		if (user != null && user.isEnabled() && user.isAccountNonLocked()&&!user.getRoles().contains(Role.ROLE_USER))
		{
			emailService.sendTemplateMessage(user.getEmail(), "Welcome to iLab", "welcome-email.ftl", user);

		}
	}
	public void sendActivation(UUID codeId) throws Exception
	{
		ActivationCode code = activationCodeRepo.findByIdAndUsedFalseAndSentFalse(codeId).orElse(null);

		if (code != null && !code.getUser().isEnabled())
		{
			System.out.println("Activation Code:"+code.getCode());
			emailService.sendTemplateMessage(code.getUser().getEmail(), "iLab Account Activation",
					"activation-email.ftl", code);
			code.setSent(true);

		}
	}
	public boolean resendActivationCode(String username)
	{
		boolean status = false;
		ActivationCode code = activationCodeRepo.findByUser_UsernameIgnoreCaseAndUsedFalse(username).orElse(null);
		if (code != null && !code.isUsed() && !code.getUser().isEnabled())
		{
			code.setSent(false);
			code.setCode(String.format("%06d", new Random().nextInt(999999)));
			jmsTemplate.convertAndSend(activationCodeQueue, code.getId());
			status = true;
		}

		return status;
	}
	
	public void sendResetPasswordToken(UUID tokenId) throws Exception
	{
		PasswordResetToken token = passwordTokenRepo.findByIdAndUsedFalseAndSentFalse(tokenId).orElse(null);
		if (token != null)
		{
			emailService.sendTemplateMessage(token.getUser().getEmail(), "FabriHub Account Reset Password",
					"resetPassword-email.ftl", token);

			token.setSent(true);

		}
	}
	
}
