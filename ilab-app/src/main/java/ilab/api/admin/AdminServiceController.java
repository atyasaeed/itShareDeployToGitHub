package ilab.api.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.Service;
import ilab.core.service.ServiceService;

@RestController
@RequestMapping(path = AdminServiceController.REST_URL,produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminServiceController
{
	static final String REST_URL = "/api/admin/services";

	@Autowired
	ServiceService serviceService;
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Service addService(@RequestPart("service") Service service, @RequestParam("file") MultipartFile file)
	{
		Service aService= serviceService.createService(service,file);
		return aService;
	}
	@PutMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	
	public Service updateService(@RequestPart("service") Service service, @RequestParam(name = "file",required = false) MultipartFile file)
	{
		Service aService= serviceService.updateService(service, file);
		return aService;
	}

//	@GetMapping("/search")
//	public Page<Service> getUsersPageable(@PageableDefault(value = 10, sort =
//	{ "name" }) Pageable page, @SearchSpec Specification<Service> specs)
//	{
//		return serviceRepo.findAll(specs,page);
//	}

}
