package ilab;

import java.util.Collections;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

@SpringBootApplication
@EnableScheduling
public class ILabApplication
{
	public static void main(String[] args)
	{
		SpringApplication.run(ILabApplication.class, args);
	}

	@Bean
	ErrorViewResolver supportPathBasedLocationStrategyWithoutHashes()
	{
		return new ErrorViewResolver()

		{
			@Override
			public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status,
					Map<String, Object> model)
			{
				ModelAndView result = status == HttpStatus.NOT_FOUND
						? new ModelAndView("index.html", Collections.<String, Object>emptyMap(), HttpStatus.OK)
						: null;
				return result;
			}
		};
	}
	@Bean
	public ResourceBundleMessageSource messageSource()
	{

		var source = new ResourceBundleMessageSource();
		source.setBasenames("messages");
		source.setUseCodeAsDefaultMessage(true);

		return source;
	}
	@Bean
	public LocaleResolver localeResolver()
	{
		CookieLocaleResolver clr=new CookieLocaleResolver();
		clr.setCookieName("fabrihub.LOCALE");
		return clr;
//		SessionLocaleResolver slr = new SessionLocaleResolver();
//		return slr;
	}
	@Bean
	public LocaleChangeInterceptor localeChangeInterceptor()
	{
		LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
		lci.setParamName("lang");
		return lci;
	}
	@Bean
	public WebMvcConfigurer adapter()
	{
		return new WebMvcConfigurer()
		{
			@Override
			public void addInterceptors(InterceptorRegistry registry)
			{
				registry.addInterceptor(localeChangeInterceptor());
			}
		};
	}
//	@Bean
//	public FreeMarkerConfigurer freeMarkerConfigurer()
//	{
//		FreeMarkerConfigurer freeMarkerConfigurer = new FreeMarkerConfigurer();
//		freeMarkerConfigurer.setConfigLocation(resource);
//		freeMarkerConfigurer.setTemplateLoaderPath("classpath:/templates2"); // defines the classpath location of the
//																			// freemarker templates
//		freeMarkerConfigurer.setDefaultEncoding("UTF-8"); // Default encoding of the template files
//		return freeMarkerConfigurer;
//	}
//	@Bean
//    public FreeMarkerConfigurationFactoryBean getFreeMarkerConfiguration() {
//        FreeMarkerConfigurationFactoryBean bean = new FreeMarkerConfigurationFactoryBean();
//        bean.setTemplateLoaderPath("/templates/");
//        
//        return bean;
//    }

}
