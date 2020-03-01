package ilab.core.services.strategy;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import ilab.core.domain.LineItem;
@Component
public class PricingFor3D implements PricingStrategy
{

	@Override
	public void price(LineItem item)
	{
		item.setUnitPrice(BigDecimal.ONE);
		// TODO Auto-generated method stub
	}

}
