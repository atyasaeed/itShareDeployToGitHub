package ilab.core.services.strategy;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import ilab.core.domain.order.LineItem;
@Component
public class DefaultDeliveryDateStrategy implements DeliveryDateStrategy
{

	@Override
	public void estimate(LineItem item)
	{
		item.setEstimatedEndDate(add(LocalDateTime.now(), 2));

	}

}
