package ilab.jms;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.JmsListener;

import ilab.core.service.OrderService;
import ilab.core.service.OrganizationUserService;
import ilab.core.service.UserService;

@Configuration
public class MessagingConfig
{
	private static final Logger log = LoggerFactory.getLogger(MessagingConfig.class);
	@Autowired
	private UserService userService;
	@Autowired
	private OrderService orderService;
	@Autowired
	private OrganizationUserService orgUserService;

	@JmsListener(destination = "${iLab.queues.orderRejection}")
	public void processOrderRejection(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderRejectionMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.orderQuoted}")
	public void processOrderQuoted(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderQuotedMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.orderInprogress}")
	public void processOrderInprogress(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderInprogressMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.orderExpired}")
	public void processOrderExpired(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderExpiredMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.orderFinished}")
	public void processOrderFinished(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderFinishedMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.orderDelivered}")
	public void processOrderDelivered(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderDeliveredMsg(dto.get("AcctMgr"), UUID.fromString(dto.get("orderId")));

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${ilab.queues.welcome}")
	public void processWelcome(UUID userId)
	{
		System.out.println("Welcome for :" + userId);
		try
		{
			userService.sendWelcomeMsg(userId);

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}

	}

	@JmsListener(destination = "${iLab.queues.activationCode}")
	public void processActivationCode(UUID codeId)
	{
		System.out.println("Activation Code:" + codeId);
		try
		{
			userService.sendActivation(codeId);

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	@JmsListener(destination = "${iLab.queues.passwordToken}")
	public void processPasswordToken(UUID tokenId)
	{
		System.out.println("Password Token:" + tokenId);
		try
		{
			userService.sendResetPasswordToken(tokenId);

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}

	}

	@JmsListener(destination = "${iLab.queues.organizationUserInvitation}")
	public void processInvitation(UUID id)
	{
		try
		{
			orgUserService.sendInvitation(id);

		} catch (Exception ex)
		{
			ex.printStackTrace();
		}

	}

}