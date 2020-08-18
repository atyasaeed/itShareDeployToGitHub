package ilab.core.services.strategy;

import ilab.core.domain.order.LineItem;

public interface PricingStrategy
{
	void price(LineItem item);
}
