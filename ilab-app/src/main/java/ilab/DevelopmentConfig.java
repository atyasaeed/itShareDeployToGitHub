package ilab;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import ilab.domain.Service;
import ilab.repos.ServiceRepository;

@Profile("!Prod")
@Configuration
public class DevelopmentConfig
{
	@Bean
	public CommandLineRunner dataLoader(ServiceRepository serviceRepo) {
		return new CommandLineRunner()
		{
			
			@Override
			public void run(String... args) throws Exception
			{
				serviceRepo.save(new Service("3D Printing","3D Printing Description"));
				serviceRepo.save(new Service("Laser Cutting","Laser Cutting Description"));
				serviceRepo.save(new Service("CNC Routers","CNC Routers Description"));
				
			}
		};
	}
}
