package ilab.core.service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import ilab.core.domain.order.OrderEntity;
import ilab.core.domain.order.OrderStatus;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationUser;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.OrganizationUserRepository;
import ilab.core.repository.UserRepository;
import ilab.jms.MessagingConfig;
import ilab.utils.exception.NotFoundException;

@Service
@Transactional
public class OrganizationUserService
{

	@Autowired
	private OrganizationUserRepository orgUserRepo;
	@Autowired
	private JmsTemplate jmsTemplate;
	@Autowired
	private EmailService emailService;

	@Autowired
	private OrganizationRepository orgRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private UserService userService;
	@Value("${iLab.queues.organizationUserInvitation}")
	private String organizationUserInvitationQueue;

	public OrganizationUser addMemberToOrg(User userToAdd, User userInvite) throws Exception
	{
		Organization org = userInvite.getDefaultOrg();
		if (org.getOwner() == userInvite && org.getStatus() == OrganizationStatus.ACTIVE
				&& userToAdd.getEmail() != userInvite.getEmail())
		{

			OrganizationUser tempOrgUser = new OrganizationUser();
			tempOrgUser.setOrg(org);
			tempOrgUser.setUser(userToAdd);
			tempOrgUser.setStatus(Role.ROLE_INVITED);
			OrganizationUser orgUser = orgUserRepo.save(tempOrgUser);
//			OrganizationUser orgUser = orgUserRepo.findByUser(userToAdd).orElseThrow();
			Map<String, String> dto = Map.of("user", userToAdd.getEmail(), "organizationUserId",
					orgUser.getId().toString());

			jmsTemplate.convertAndSend(organizationUserInvitationQueue, dto);
			return tempOrgUser;
		} else
		{
			throw new NotFoundException(
					"1-You should be the owner of the Organization" + "OrganizationType should be active");
		}

	}

	public void deleteMemberFromOrg(User userAdded, Authentication auth)
	{
		User user = userService.findUser(auth);
		Organization org = user.getDefaultOrg();
		OrganizationUser orgUser = orgUserRepo.findByUserAndOrg(userAdded, org).orElseThrow();
		orgUserRepo.delete(orgUser);
	}

	public OrganizationUser acceptInvitation(OrganizationUser orgUser, Authentication auth) throws Exception
	{
		User userToAdd = userService.findUser(auth);
		if (orgUser.getUser() == userToAdd && orgUser.getStatus() == Role.ROLE_INVITED)
		{
			orgUser.setStatus(Role.ROLE_MEMBER);
			return orgUserRepo.save(orgUser);

		} else
		{
			throw new Exception();
		}
	}

	public Page<OrganizationUser> findAll(Specification<OrganizationUser> specs, Pageable page)
	{
		return orgUserRepo.findAll(specs, page);
	}

	public Page<OrganizationUser> findByUser(User user, Pageable page)
	{
		return orgUserRepo.findAllByUser(user, page);
	}

	public Page<OrganizationUser> findByOrg(Organization org, Pageable page)
	{
		return orgUserRepo.findAllByOrg(org, page);
	}

	public Optional<OrganizationUser> findbyId(UUID id)
	{
		// TODO Auto-generated method stub
		return orgUserRepo.findById(id);
	}

	public void deleteOrganizationUser(OrganizationUser orgUser, Authentication auth)
	{
		// TODO Auto-generated method stub

		orgUserRepo.delete(orgUser);

	}

	public void sendInvitation(String email, UUID id) throws Exception
	{
		OrganizationUser org = orgUserRepo.findById(id).orElseThrow();
		User user = findByemail(email);
		Map<String, Object> dto = Map.of("user", user.getFirstName(), "organizationUserId", org.getId());

		emailService.sendTemplateMessage(user.getEmail(),
				String.format("Your are Invited to join  %s has been finished", org.getId()),
				"organization-user-invitation.ftl", dto);

	}

	public User findByemail(String email)
	{
		return userRepo.findByemailIgnoreCase(email).orElseThrow();
	}
}
