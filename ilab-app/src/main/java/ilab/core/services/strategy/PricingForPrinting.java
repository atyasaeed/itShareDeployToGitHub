package ilab.core.services.strategy;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Component;

import ilab.core.domain.HyperFile;
import ilab.core.domain.LineItem;

@Component
public class PricingForPrinting implements PricingStrategy
{

	@Override
	public void price(LineItem item)
	{
		int totalPages=0;
		for(HyperFile hyperFile:item.getFiles())
		{
			if(hyperFile==null) continue;
			File destPath=new File("D:\\workspaces\\ilab\\resources\\files\\"+item.getOrderEntity().getAccount().getId()+"\\"+hyperFile.getAsset().getId());
			PDDocument doc;
			try
			{
				doc = PDDocument.load(destPath);
				totalPages+= doc.getNumberOfPages();
				doc.close();
			} catch (IOException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
				return;
			}
			
		}
		item.setUnitPrice(new BigDecimal(totalPages*.1));
	}

}