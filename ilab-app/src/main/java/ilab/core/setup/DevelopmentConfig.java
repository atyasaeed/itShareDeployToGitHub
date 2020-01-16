package ilab.core.setup;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.google.common.io.Files;

import ilab.core.domain.Authority;
import ilab.core.domain.Service;
import ilab.core.domain.User;
import ilab.core.repository.ServiceRepository;
import ilab.core.repository.UserRepository;
import ilab.core.service.UserService;

@Profile("!Prod")
@Configuration
public class DevelopmentConfig
{
	@Autowired
	private PasswordEncoder encoder;
	@Autowired
	private UserService userService;
	@Bean
	public CommandLineRunner dataLoader(ServiceRepository serviceRepo,UserRepository userRepo) {
		return new CommandLineRunner()
		{
			
			@Override
			public void run(String... args) 
			{
				try
				{
					Service service;
					service=serviceRepo.save(createService("3D Printing","3D Printing Description"));
					service=serviceRepo.save(service);
					Files.copy(new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));
					service=serviceRepo.save(createService("Laser Scanning","Laser Cutting Description"));
					Files.copy(new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));		
					service=serviceRepo.save(createService("CNC Routers","CNC Routers Description"));
					Files.copy(new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("F:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));
//					userRepo.save(createUser( "hasalem", "12345678"));
//					userRepo.save(createUser("mosalem", "12345678"));
					userService.register(createUser("hasalem", "New123456","Hatem","hasalem@gmail.com"));
					userService.register(createUser("mosalem", "New123456","Hatem","mosalem@gmail.com"));	
				}
				catch(Exception e)
				{
					System.out.println("===========DB Initialization Failed=========");
				}
				
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
	private User createUser(String username,String password,String firstName,String email)
	{
		User user=new User();
		user.setUsername(username);
//		user.setPassword(encoder.encode(password));
		user.setPassword(password);
		user.setFirstName(firstName);
		user.setEmail(email);
//		user.setEnabled(true);
//		user.setAccountNonLocked(true);
//		user.addAuthority(createAuthority(user));
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
