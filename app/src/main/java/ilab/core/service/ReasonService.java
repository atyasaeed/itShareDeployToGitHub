package ilab.core.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import ilab.core.domain.Reason;
import ilab.core.domain.ReasonStatus;
import ilab.core.repository.ReasonRepository;

@org.springframework.stereotype.Service
@Transactional
public class ReasonService
{
	@Autowired
	ReasonRepository repo;
	public Reason create(Reason reason)
	{
		return repo.save(reason);
	}
	public Reason update(Reason reason)
	{
		Reason existingReason=repo.findById(reason.getId()).orElseThrow();
		existingReason.setName(reason.getName());
		existingReason.setStatus(reason.getStatus());
		return repo.save(existingReason);
	}
	public void delete(UUID id)
	{
		Reason reason=repo.findById(id).orElseThrow();
		reason.setStatus(ReasonStatus.DELETED);
		
	}
}
