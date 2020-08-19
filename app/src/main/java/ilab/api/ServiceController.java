package ilab.api;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sipios.springsearch.anotation.SearchSpec;

import ilab.core.domain.Service;
import ilab.core.repository.ServiceRepository;
import ilab.core.service.ServiceService;

@RestController
@RequestMapping(path = ServiceController.REST_URL,produces = MediaType.APPLICATION_JSON_VALUE)

public class ServiceController
{
	static final String REST_URL = "/api/service";
	@Autowired
	ServiceRepository serviceRepo;
	@Autowired
	ServiceService serviceService;
	@RequestMapping( method=RequestMethod.GET)
	public Iterable<Service> recentServices()
	{
		PageRequest page=PageRequest.of(0, 20,Sort.by("updated").descending());
		return serviceRepo.findAll(page).getContent();
	}
	@GetMapping("/{id}")
	public ResponseEntity<Service> serviceById(@PathVariable("id") UUID id)
	{
		Optional<Service> optService= serviceRepo.findById(id);
		if(optService.isPresent())
			return new ResponseEntity<Service>(optService.get(), HttpStatus.OK);
		return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
	}
	@GetMapping("/search")
	public Page<Service> getServicesPageable(@PageableDefault(value = 10, sort =
	{ "name" }) Pageable page, @SearchSpec Specification<Service> specs)
	{
		return serviceRepo.findAll(specs,page);
	}
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Service addService(@RequestPart("service") Service service, @RequestParam("file") MultipartFile file)
	{
		Service aService= serviceService.createService(service,file);
		return aService;
	}

	@PutMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public Service updateService(@RequestPart("service") Service service, @RequestParam(name = "file",required = false) MultipartFile file)
	{
		Service aService= serviceService.updateService(service, file);
		return aService;
	}
	
}
