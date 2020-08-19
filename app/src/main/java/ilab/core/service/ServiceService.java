package ilab.core.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.Service;
import ilab.core.repository.ServiceRepository;

@org.springframework.stereotype.Service
@Transactional
public class ServiceService
{
	@Autowired
	ServiceRepository serviceRepo;
	@Autowired 
	AmazonClient  amazonClient;
	public Service createService(Service service,MultipartFile file)
	{
		service.setImage(file.getOriginalFilename());
		service=serviceRepo.save(service);
		String path="services/"+service.getId();
		amazonClient.uploadFile( file,file.getOriginalFilename(),path);
		return service;
	}
	public Service updateService(Service service,MultipartFile file)
	{
		Service existingService= serviceRepo.findById(service.getId()).orElseThrow();
		if(file!=null)
		{
			String path="services/"+existingService.getId();
			amazonClient.uploadFile( file,file.getOriginalFilename(),path);
			existingService.setImage(file.getOriginalFilename());
		}
		existingService.setName(service.getName());
		existingService.setColors(service.getColors());
		existingService.setDescription(service.getDescription());
		existingService.setExtensions(service.getExtensions());
		existingService.setMaterials(service.getMaterials());
		existingService.setProcesses(service.getProcesses());
		existingService.setThickness(service.getThickness());
		existingService.setTypes(service.getTypes());
		existingService.setUnits(service.getUnits());
		return existingService;
		
	}
}
