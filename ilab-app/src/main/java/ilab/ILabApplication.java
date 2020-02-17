package ilab;

import java.util.Collections;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

@SpringBootApplication
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
