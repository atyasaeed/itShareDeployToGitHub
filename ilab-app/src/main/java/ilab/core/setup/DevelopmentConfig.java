package ilab.core.setup;

import java.io.File;
import java.io.InputStream;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.ResourceUtils;

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
	ResourceLoader resourceLoader;
	@Value("${iLab.paths.files}")
	String filesPath;
	@Value("${iLab.paths.initFiles}")
	String initFilesPath;
	@Value("${iLab.paths.images}")
	String imagesPath;
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
					service=serviceRepo.save(createService("3D Printing","3D Printing Mono Color",1,"serviceTemplate.json","serviceFileExtensions.json","Working Area 1","3d"));
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));

					service=serviceRepo.save(createService("3D Printing2","3D Printing Multi Color",2,"serviceTemplate.json","serviceFileExtensions.json","Working Area 2","3d"));
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));
					
					service=serviceRepo.save(createService("Laser Scanning","Laser Cutting Description",1,"serviceTemplate2.json","serviceFileExtensions.json","Working Area 2","15"));
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));		

					service=serviceRepo.save(createService("CNC Routers","CNC Routers Description",3,"serviceTemplate3.json","serviceFileExtensions.json","Working Area 3","20"));
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));
					
					service=createService("Photocopy","ASU, Faculty of Engineering, Notes for the first year",0,"serviceTemplate4.json","serviceFileExtensions.json","Working Area 3","30");
					service.setAttendance(false);
					service=serviceRepo.save(service);
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));
					service=createService("Photocopy 2","ASU, Faculty of Engineering, Notes for the first year",1,"serviceTemplate4.json","printFileExtensions.json","Working Area 3","printing");
					service.setAttendance(false);
					service=serviceRepo.save(service);
					Files.copy(new File(initFilesPath+service.getName()+".jpg"), new File(imagesPath+service.getId()+".jpg"));

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
		
		
//		File resource=getClass().getResource("contents/"+file).getFile();
//		String fileUrl=getClass().getResource("contents/"+file).getFile();
//		File resource = new ClassPathResource("classpath:contents/"+file).getFile();
		InputStream inputstream=DevelopmentConfig.class.getResourceAsStream("/contents/"+file);
		//		InputStream inputstream=new ClassPathResource("classpath:contents/"+file).getInputStream();
		String content=new String(FileCopyUtils.copyToByteArray(inputstream));
//		File resource= resourceLoader.getResource("classpath:contents/"+file).getFile();
//		File resource = new ClassPathResource(getClass().getResource("contents/"+file).getFile()).getFile();
//		String content = new String(java.nio.file.Files.readAllBytes(resource.toPath()));
		
		return content;
		
	}
	private Service createService(String name,String desc,int maxFiles,String templateFile,String fileExtensions,String workingArea,String pricing) throws Exception
	{
		Service service=new Service();
		service.setName(name);
		service.setDescription(desc);
		service.setMaxFiles(maxFiles);
		service.setWorkingArea(workingArea);
		
		service.setTemplate(getFileContent(templateFile).replaceAll("\\s", ""));
		service.setExtensions(getFileContent(fileExtensions).replaceAll("\\s", ""));
		service.setAttendance(new Random().nextInt()%2==0);
	
		service.setUnits(getFileContent("serviceFileUnits.json").replaceAll("\\s", ""));
		service.setPricing(pricing);
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
