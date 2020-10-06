package ilab.core.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.State;
import ilab.core.repository.StateRepository;

@Service
@Transactional
public class StateService
{
	@Autowired
	private StateRepository stateRepo;

	public State create(State state, Authentication auth)
	{
		return stateRepo.save(state);
	}

	public State get(UUID id, Authentication auth)
	{
		return stateRepo.findById(id).orElseThrow();
	}

	public State update(State state, Authentication auth)
	{
		
		return stateRepo.save(state);
	}

	public void delete(UUID id, Authentication auth)
	{
		stateRepo.deleteById(id);
	}

	public Page<State> getPageable(Specification<State> specs, Pageable pageable)
	{
		return stateRepo.findAll(specs, pageable);
	}

}
