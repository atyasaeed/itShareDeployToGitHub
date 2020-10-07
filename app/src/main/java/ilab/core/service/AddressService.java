package ilab.core.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.user.Address;
import ilab.core.domain.user.User;
import ilab.core.repository.AddressRepository;
import ilab.core.repository.UserRepository;

@Service
@Transactional
public class AddressService
{
	@Autowired
	AddressRepository addressRepo;
	@Autowired
	UserRepository userRepo;

	public Address save(Address entity, Authentication auth)
	{
		User user = userRepo.findByemailIgnoreCase(auth.getName()).orElseThrow();
		entity.setUser(user);
		return addressRepo.save(entity);
	}

	public void remove(UUID id, Authentication auth)
	{
		addressRepo.deleteByIdAndUser_username(id, auth.getName());

	}

	public Address findUserAddress(UUID id, Authentication auth)
	{
		return addressRepo.findByIdAndUser_username(id, auth.getName()).orElseThrow();
	}

	public Address update(Address entity, Authentication auth)
	{
		Address persistedAddress = addressRepo.findByIdAndUser_username(entity.getId(), auth.getName()).orElseThrow();
		BeanUtils.copyProperties(entity, persistedAddress, "id", "created", "updated", "version", "user");
		return persistedAddress;
	}

}
