package ilab.core.setup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import ilab.core.domain.Authority;
import ilab.core.domain.Service;
import ilab.core.domain.User;
import ilab.core.repository.ServiceRepository;
import ilab.core.repository.UserRepository;

@Profile("!Prod")
@Configuration
public class DevelopmentConfig
{
	@Autowired
	private PasswordEncoder encoder;
	@Bean
	public CommandLineRunner dataLoader(ServiceRepository serviceRepo,UserRepository userRepo) {
		return new CommandLineRunner()
		{
			
			@Override
			public void run(String... args) throws Exception
			{
				serviceRepo.save(createService("3D Printing","3D Printing Description"));
				serviceRepo.save(createService("Laser Cutting","Laser Cutting Description"));
				serviceRepo.save(createService("CNC Routers","CNC Routers Description"));
				userRepo.save(createUser( "hasalem", "12345678"));
				userRepo.save(createUser("mosalem", "12345678"));
			}
		};
	}
	private Service createService(String name,String desc)
	{
		Service service=new Service();
		service.setName(name);
		service.setDescription(desc);
		return service;
	}
	private User createUser(String username,String password)
	{
		User user=new User();
		user.setUsername(username);
		user.setPassword(encoder.encode(password));
		user.setEnabled(true);
		user.setAccountNonLocked(true);
		user.addAuthority(createAuthority(user));
		return user;
	}
	private User addUserRoleAuthority(User user)
	{
		Authority roleUser=new Authority();
		roleUser.setAuthority("ROLE_USER");
		roleUser.setUser(user);
		user.addAuthority(roleUser);
		return user;
	}
	private Authority createAuthority(User user)
	{
		Authority roleUser=new Authority();
		roleUser.setAuthority("ROLE_USER");
		roleUser.setUser(user);
		return roleUser;
	}
}
