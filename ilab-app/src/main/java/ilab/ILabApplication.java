package ilab;

import java.util.Collections;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;

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

}
