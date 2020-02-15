package ilab.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import ilab.core.service.EmailService;

@Component
public class SendEmailListener implements ApplicationListener<SendEmailEvent>
{
	@Autowired
	private EmailService emailService;
	@Override
	public void onApplicationEvent(SendEmailEvent event)
	{
		try
		{
			emailService.sendTemplateMessage(event.getTo(), event.getSubject(), event.getTemplate(), event.getSource());
		} catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
