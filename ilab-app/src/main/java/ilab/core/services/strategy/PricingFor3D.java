package ilab.core.services.strategy;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import ilab.core.domain.HyperFile;
import ilab.core.domain.LineItem;
@Component
public class PricingFor3D implements PricingStrategy
{
	@Value("${iLab.paths.files}")
	String filesPath;
	@Override
	public void price(LineItem item)
	{
		double totalTime=0;
		double totalWeight=0;
		HttpPost post = new HttpPost("http://3dpartprice.com/3dpartpricelib/api-caller.php");
		MultipartEntityBuilder builder = MultipartEntityBuilder.create()
				.setMode(HttpMultipartMode.BROWSER_COMPATIBLE)
				.addPart("material", new StringBody("PC", ContentType.MULTIPART_FORM_DATA))
				.addPart("color", new StringBody("#FF8324", ContentType.MULTIPART_FORM_DATA))
				.addPart("layerHeight", new StringBody("0.2", ContentType.MULTIPART_FORM_DATA))
				.addPart("infillPercentage", new StringBody("20", ContentType.MULTIPART_FORM_DATA))
				.addPart("shipping", new StringBody("delivery", ContentType.MULTIPART_FORM_DATA));
		for(HyperFile hyperFile:item.getFiles())
		{
			if(hyperFile==null) continue;

			File file=new File(filesPath+item.getOrderEntity().getAccount().getId()+"\\"+hyperFile.getAsset().getId());
			builder.addBinaryBody("stlFiles[]", file,ContentType.DEFAULT_BINARY,hyperFile.getAsset().getName());
		}
		
		
		try
		{
			HttpEntity entity = builder.build();
			CloseableHttpClient httpclient = HttpClients.createDefault();
			post.setEntity(entity);
			CloseableHttpResponse response= httpclient.execute(post);
			
			String result=EntityUtils.toString(response.getEntity()).replaceAll("\\s", "");
			Pattern pattern = Pattern.compile("\\[amount\\]=>(\\d*.\\d*)\\[unit]");
			Matcher matcher = pattern.matcher(result);
			if (matcher.find() & matcher.groupCount() == 1)
			{
				totalWeight = Double.parseDouble(matcher.group(1));
				if (matcher.find() & matcher.groupCount() == 1)
				{
					totalTime = Double.parseDouble(matcher.group(1));
				}
				item.setUnitPrice(new BigDecimal((totalWeight*.6+totalTime*31.0/3600.0+20)*1.15));
			}
			
		} catch (NumberFormatException | IOException e)
		{
		}
		
		
	}

}
