package ilab.utils;

import org.springframework.context.ApplicationEvent;

public class SendEmailEvent extends ApplicationEvent
{
	private String to;
	private String subject;
	private String template;
	public SendEmailEvent(String to,String subject,String template,Object source)
	{
		super(source);
		this.to=to;
		this.subject=subject;
		this.template=template;
		
	}
	public String getTo()
	{
		return to;
	}
	public void setTo(String to)
	{
		this.to = to;
	}
	public String getSubject()
	{
		return subject;
	}
	public void setSubject(String subject)
	{
		this.subject = subject;
	}
	public String getTemplate()
	{
		return template;
	}
	public void setTemplate(String template)
	{
		this.template = template;
	}

}
