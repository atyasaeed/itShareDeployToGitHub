package ilab.utils;

import java.util.Map;

import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes
{ 
	@Override
	public Map<String, Object> getErrorAttributes(WebRequest webRequest, boolean includeStackTrace)
	{
		Map<String, Object> errorAttributes = 
		          super.getErrorAttributes(webRequest, includeStackTrace);
		return errorAttributes;
	}
}
