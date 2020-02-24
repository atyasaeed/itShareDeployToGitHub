package ilab.core.setup;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.google.common.io.Files;

import freemarker.template.Template;
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
	private UserService userService;
	@Autowired
	public freemarker.template.Configuration freemarkerConfig;
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
					service=serviceRepo.save(createService("3D Printing","3D Printing Description",2,"serviceTemplate.json","serviceFileExtensions.json","Working Area 1"));
					service=serviceRepo.save(service);
					Files.copy(new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));
					service=serviceRepo.save(createService("Laser Scanning","Laser Cutting Description",1,"serviceTemplate.json","serviceFileExtensions.json","Working Area 2"));
					Files.copy(new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));		
					service=serviceRepo.save(createService("CNC Routers","CNC Routers Description",3,"serviceTemplate.json","serviceFileExtensions.json","Working Area 3"));
					Files.copy(new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getName()+".jpg"), new File("D:\\workspaces\\ilab\\resources\\images\\"+service.getId()+".jpg"));
//					userRepo.save(createUser( "hasalem", "12345678"));
//					userRepo.save(createUser("mosalem", "12345678"));
					userService.register(createUser("hasalem", "New123456","Hatem","hasalem@gmail.com"));
					userService.register(createUser("mosalem", "New123456","Hatem","mosalem@gmail.com"));
					User user=userService.register(createUser("admin", "New123456","Admin","admin@gmail.com"));
					user=addAdminRoleAuthority(user);
					userRepo.save(user);
				}
				catch(Exception e)
				{
					
					System.out.println("===========DB Initialization Failed=========");
					System.out.println(e);
					e.printStackTrace();
				}
				
			}
		};
	}
	public String getFileContent(String file) throws Exception
	{
		File resource = new ClassPathResource("contents/"+file).getFile();
		String content = new String(java.nio.file.Files.readAllBytes(resource.toPath()));
		return content;
		
	}
	private Service createService(String name,String desc,int maxFiles,String templateFile,String fileExtensions,String workingArea) throws Exception
	{
		Service service=new Service();
		service.setName(name);
		service.setDescription(desc);
		service.setMaxFiles(maxFiles);
		service.setWorkingArea(workingArea);
		
		service.setTemplate(getFileContent(templateFile).replaceAll("\\s", ""));
		service.setExtensions(getFileContent(fileExtensions).replaceAll("\\s", ""));
		
		
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
	private User addAdminRoleAuthority(User user)
	{
		Authority roleUser=new Authority();
		roleUser.setAuthority("ROLE_ADMIN");
		roleUser.setUser(user);
		user.addAuthority(roleUser);
		return user;
	}
//	private Authority createAuthority(User user)
//	{
//		Authority roleUser=new Authority();
//		roleUser.setAuthority("ROLE_USER");
//		roleUser.setUser(user);
//		return roleUser;
//	}
}
