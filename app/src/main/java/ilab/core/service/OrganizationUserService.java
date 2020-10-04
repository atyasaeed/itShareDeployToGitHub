package ilab.core.service;

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

import ilab.core.domain.user.Organization;
import ilab.core.domain.user.OrganizationStatus;
import ilab.core.domain.user.OrganizationUser;
import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;
import ilab.core.repository.OrganizationRepository;
import ilab.core.repository.OrganizationUserRepository;
import ilab.core.repository.UserRepository;
import ilab.utils.exception.IllegalRequestDataException;

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

	public OrganizationUser addMemberToOrg(String email, Authentication auth) throws Exception
	{
		User invitee = findByemail(email);

		User inviter = userService.findUser(auth);
		Organization org = inviter.getDefaultOrg();

		if (org.getOwner() != inviter)
		{
			throw new IllegalRequestDataException("Inviter is not the organization owner");
		}
		if (org.getStatus() != OrganizationStatus.ACTIVE)
		{
			throw new IllegalRequestDataException("Organization is not active");
		}
		if (invitee.getEmail().equals(inviter.getEmail()))
		{
			throw new IllegalRequestDataException("Invitee is the owner");
		}

		OrganizationUser orgUser = new OrganizationUser();
		orgUser.setOrg(org);
		orgUser.setUser(invitee);
		orgUser.setPlacedBy(inviter);
		orgUser.setRole(Role.ROLE_INVITED);
		orgUserRepo.save(orgUser);

		jmsTemplate.convertAndSend(organizationUserInvitationQueue, orgUser.getId());
		return orgUser;

	}

	public void deleteMemberFromOrg(User userAdded, Authentication auth)
	{
		User user = userService.findUser(auth);
		Organization org = user.getDefaultOrg();
		OrganizationUser orgUser = orgUserRepo.findByUserAndOrg(userAdded, org).orElseThrow();
		orgUserRepo.delete(orgUser);
	}

	public OrganizationUser acceptInvitation(UUID orgUserId, Authentication auth) throws Exception
	{
		OrganizationUser orgUser = orgUserRepo.findById(orgUserId).orElseThrow();

		if (orgUser.getUser().getEmail().equals(auth.getName()))
		{
			orgUser.setRole(Role.ROLE_MEMBER);
			return orgUserRepo.save(orgUser);

		} else
		{
			throw new IllegalRequestDataException("Invalid Invitation");
		}
	}

	public Page<OrganizationUser> findAll(Specification<OrganizationUser> specs, Pageable page)
	{
		return orgUserRepo.findAll(specs, page);
	}

	public Page<OrganizationUser> findByUser(Authentication auth, Pageable page)
	{
		return orgUserRepo.findByUser_usernameIgnoreCase(auth.getName(), page);
	}

	public Page<OrganizationUser> findByOrg(Authentication auth, Pageable page)
	{
		return orgUserRepo.findByOrg_owner_usernameIgnoreCase(auth.getName(), page);
	}

	public Optional<OrganizationUser> findbyId(UUID id)
	{
		return orgUserRepo.findById(id);
	}

	public void deleteOrganizationUser(UUID orgUserId, Authentication auth)
	{
		OrganizationUser orgUser = orgUserRepo.findById(orgUserId).orElseThrow();
		if (orgUser.getUser().getEmail().equals(auth.getName())
				|| orgUser.getOrg().getOwner().getEmail().equals(auth.getName()))
		{
			orgUserRepo.delete(orgUser);
		} else
		{
			throw new IllegalRequestDataException("Not authorized");
		}

	}

	public void sendInvitation(UUID id) throws Exception
	{
		OrganizationUser orgUser = orgUserRepo.findById(id).orElseThrow();

		emailService.sendTemplateMessage(orgUser.getUser().getEmail(),
				String.format("Your are Invited to join  %s ", orgUser.getOrg().getName()),
				"organization-user-invitation.ftl", orgUser);

	}

	public User findByemail(String email)
	{
		return userRepo.findByemailIgnoreCase(email).orElseThrow();
	}

	public OrganizationUser findById(UUID id, Authentication auth)
	{
		return orgUserRepo.findByIdAndUser_usernameIgnoreCase(id,auth.getName()).orElseThrow();
	}
}
