package ilab.core.services.strategy;

import ilab.core.domain.LineItem;

public interface PricingStrategy
{
	void price(LineItem item);
}
