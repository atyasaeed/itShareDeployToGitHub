package ilab.jms;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.JmsListener;

import ilab.core.service.OrderService;
import ilab.core.service.UserService;



@Configuration
public class MessagingConfig
{
	private static final Logger log = LoggerFactory.getLogger(MessagingConfig.class);
	@Autowired
	private UserService userService;
	@Autowired
	private OrderService orderService;
	@JmsListener(destination = "${iLab.queues.activationCode}")
	public void processUserVerification(UUID id)
	{
		System.out.println("User Id:"+id);
		try
		{
			userService.sendVerfication(id);
			
		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}
	@JmsListener(destination = "${iLab.queues.orderRejection}")
	public void processOrderRejection(Map<String, String> dto)
	{
		System.out.println(dto);
		try
		{
			orderService.sendOrderRejectionMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
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
			orderService.sendOrderQuotedMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
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
			orderService.sendOrderInprogressMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
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
			orderService.sendOrderExpiredMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
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
			orderService.sendOrderFinishedMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
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
			orderService.sendOrderDeliveredMsg(dto.get("AcctMgr"),UUID.fromString(dto.get("orderId")));
			
		} catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}

	
}