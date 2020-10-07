package ilab.core.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.City;
import ilab.core.domain.State;
import ilab.core.repository.CityRepository;

@Service
@Transactional
public class CityService
{
	@Autowired
	private CityRepository cityRepo;

	public City create(City city, Authentication auth)

	{
		return cityRepo.save(city);
	}

	public void delete(UUID id, Authentication auth)
	{
		cityRepo.deleteById(id);
	}

	
	public City findById(UUID id, Authentication auth)
	{
		return cityRepo.findById(id).orElseThrow();
	}

	public Page<City> findAll(Specification<City> specs, Pageable page,Authentication auth)
	{
		return cityRepo.findAll(specs, page);
	}
}
