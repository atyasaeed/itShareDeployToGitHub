package ilab.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import freemarker.template.Configuration;
import freemarker.template.Template;

@Component
public class EmailService
{
	@Autowired
    public JavaMailSender emailSender;
	@Autowired
	public Configuration freemarkerConfig;
	public void sendSimpleMessage(String to, String subject, String text) 
	{
		SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);
        emailSender.send(message);
	}
//	public void sendSimpleMessage(String to, String subject,Map<String, Object> model) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException
//	{
//		Template t = freemarkerConfig.getTemplate("email-template.ftl");
//		String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);
//		
//		SimpleMailMessage message = new SimpleMailMessage(); 
//        message.setTo(to); 
//        message.setSubject(subject); 
//        message.setText(html);
//        emailSender.send(message);
//	}
	public void sendTemplateMessage(String to,String subject,String template,Object model) throws Exception
	{

		Template t = freemarkerConfig.getTemplate(template);
		
		String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);
		
		SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(html);
        emailSender.send(message);
	}
}
