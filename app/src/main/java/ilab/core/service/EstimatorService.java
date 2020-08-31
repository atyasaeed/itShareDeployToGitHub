package ilab.core.service;

import java.math.BigDecimal;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ilab.core.domain.order.LineItem;
import ilab.core.domain.order.OrderEntity;
import ilab.core.repository.ServiceRepository;
import ilab.core.services.strategy.DefaultDeliveryDateStrategy;
import ilab.core.services.strategy.DefaultPricingStrategy;
import ilab.core.services.strategy.PricingFor3D;
import ilab.core.services.strategy.PricingForPrinting;

@Service
@Transactional
public class EstimatorService
{
	@Autowired
	ServiceRepository serviceRepo;
	@Autowired
	PricingFor3D pricingFor3D;
	@Autowired
	PricingForPrinting pricingForPrinting;
	@Autowired
	DefaultPricingStrategy defaultPricing;
	@Autowired
	DefaultDeliveryDateStrategy defaultDeliveryDate;
	void price(LineItem item)
	{
		ilab.core.domain.Service service=serviceRepo.findById(item.getService().getId()).orElse(null);
		if(service==null)
			return;
		switch (service.getPricing().toLowerCase())
		{
		case "3d":
			pricingFor3D.price(item);
			break;
		case "printing":
			pricingForPrinting.price(item);
			break;
		default:
			item.setService(service);
			defaultPricing.price(item);
			break;
		}
		defaultDeliveryDate.estimate(item);
	}
	void price(OrderEntity order)
	{
		BigDecimal orderTotal=BigDecimal.ZERO;
		for(LineItem item:order.getLineItems())
		{
			price(item);
			orderTotal.add(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
			
		}
	}
}