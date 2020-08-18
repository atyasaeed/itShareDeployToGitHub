package ilab.core.services.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import ilab.core.domain.order.LineItem;
@Component
public class DefaultPricingStrategy implements PricingStrategy
{

	@Override
	public void price(LineItem item)
	{
		try
		{
			item.setUnitPrice(new BigDecimal(item.getService().getPricing()));

		} catch (NumberFormatException e)
		{
			item.setUnitPrice(BigDecimal.ONE);
		}
	}
}
