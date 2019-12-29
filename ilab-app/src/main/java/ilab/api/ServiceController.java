package ilab.api;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.Service;
import ilab.core.repository.ServiceRepository;

@RestController
@RequestMapping(path = "/api/services",produces = "application/json")
public class ServiceController
{
	@Autowired
	ServiceRepository serviceRepo;

	@RequestMapping( method=RequestMethod.GET)
	public Iterable<Service> recentServices()
	{
		PageRequest page=PageRequest.of(0, 20,Sort.by("updated").descending());
		return serviceRepo.findAll(page).getContent();
	}
	@GetMapping("/{id}")
	public ResponseEntity<Service> tacoById(@PathVariable("id") UUID id)
	{
		Optional<Service> optService= serviceRepo.findById(id);
		if(optService.isPresent())
			return new ResponseEntity<Service>(optService.get(), HttpStatus.OK);
		return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
	}
	@PostMapping(consumes = "application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Service postService(@RequestBody Service service)
	{
		Service aService= serviceRepo.save(service);
		return aService;
	}

}
