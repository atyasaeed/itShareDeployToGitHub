package ilab.core.setup;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import ilab.core.domain.City;
import ilab.core.domain.Reason;
import ilab.core.domain.Service;
import ilab.core.domain.State;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationType;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.CityRepository;
import ilab.core.repository.ReasonRepository;
import ilab.core.repository.ServiceRepository;
import ilab.core.repository.StateRepository;
import ilab.core.repository.UserRepository;
import ilab.core.service.ServiceService;
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
	@Value("${iLab.paths.setup}")
	private String setupPath;
	@Autowired
	private UserService userService;
	@Autowired
	private ReasonRepository reasonRepo;
	@Autowired
	public freemarker.template.Configuration freemarkerConfig;
	@Autowired
	public StateRepository stateRepo;
	@Autowired
	public CityRepository cityRepo;

	@Bean
	public CommandLineRunner dataLoader(ServiceRepository serviceRepo, UserRepository userRepo,
			ServiceService serviceService)
	{
		return new CommandLineRunner()
		{

			@Override
			public void run(String... args)
			{
				try
				{

					User user = userService.register(createUser("hatem.salem@ihub.asu.edu.eg", "New123456", "Admin",
							"hatem.salem@ihub.asu.edu.eg", "01065002100", OrganizationType.INDIVIDUAL));
					user = userService.enableUser(user.getId(), true, null);
					user = addAdminRoleAuthority(user);

					userRepo.save(user);
					user = userService.register(createUser("mosalem@itraters.com", "New123456", "Hatem",
							"mosalem@itraters.com", "01065003100", OrganizationType.PARTNER));
					user = userService.enableUser(user.getId(), true, null);
					user = addRoleAuthority(user);
					userRepo.save(user);
					user = userService.register(createUser("Karafat1998@gmail.com", "New123456", "Hatem",
							"karafat1998@gmail.com", "01002222392", OrganizationType.PARTNER));
					user = userService.enableUser(user.getId(), true, null);
					user = addRoleAuthority(user);
					userRepo.save(user);
					Service services[] = new ObjectMapper().readValue(new File(setupPath + "/services.json"),
							Service[].class);
					for (Service service : services)
					{

						File file = new File(setupPath + "/" + service.getImage());
						System.out.println(file.getPath() + ":" + file.exists());
						FileItem fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), false,
								file.getName(), (int) file.length(), file.getParentFile());
						InputStream input = new FileInputStream(file);
						OutputStream os = fileItem.getOutputStream();
						IOUtils.copy(input, os);
						MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
						input.close();
						os.close();
						serviceService.createService(service, multipartFile);
					}
					Reason reasons[] = new ObjectMapper().readValue(new File(setupPath + "/reasons.json"),
							Reason[].class);
					for (Reason reason : reasons)
					{
						reasonRepo.save(reason);
					}
					State cairoState = new State();
					cairoState.setArName("القاهرة");
					cairoState.setEnName("Cairo");
					stateRepo.save(cairoState);

					City shroukCity = new City();
					shroukCity.setArName("مدينة الشروق");
					shroukCity.setEnName("Shrouk City");
					shroukCity.setState(cairoState);
					cityRepo.save(shroukCity);

				} catch (Exception e)
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

		// File resource=getClass().getResource("contents/"+file).getFile();
		// String fileUrl=getClass().getResource("contents/"+file).getFile();
		// File resource = new
		// ClassPathResource("classpath:contents/"+file).getFile();
		InputStream inputstream = DevelopmentConfig.class.getResourceAsStream("/contents/" + file);
		// InputStream inputstream=new
		// ClassPathResource("classpath:contents/"+file).getInputStream();
		String content = new String(FileCopyUtils.copyToByteArray(inputstream));
		// File resource=
		// resourceLoader.getResource("classpath:contents/"+file).getFile();
		// File resource = new
		// ClassPathResource(getClass().getResource("contents/"+file).getFile()).getFile();
		// String content = new
		// String(java.nio.file.Files.readAllBytes(resource.toPath()));

		return content;

	}

	private User createUser(String username, String password, String firstName, String email, String mobileNo,
			OrganizationType type)
	{
		User user = new User();
		user.setUsername(username);
		// user.setPassword(encoder.encode(password));
		user.setPassword(password);
		user.setFirstName(firstName);
		user.setEmail(email);
		user.setMobileNo(mobileNo);
		Organization org = new Organization();
		org.setName(user.getFirstName());
		org.setMobileNo(user.getMobileNo());
		org.setCity("city");
		org.setAddress("address");
		org.setType(type);
		org.setStatus(OrganizationStatus.PENDING);
		user.setDefaultOrg(org);
		user.addRole(Role.ROLE_USER);
		// user.setEnabled(true);
		// user.setAccountNonLocked(true);
		// user.addAuthority(createAuthority(user));
		return user;
	}

	private User addAdminRoleAuthority(User user)
	{
		user.addRole(Role.ROLE_ADMIN);
		user.addRole(Role.ROLE_USER);
		return user;
	}

	private User addRoleAuthority(User user)
	{
		user.addRole(Role.ROLE_USER);
		return user;
	}

}
