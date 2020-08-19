package ilab.core.services.strategy;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

import ilab.core.domain.order.LineItem;

public interface DeliveryDateStrategy
{
	void estimate(LineItem item);
	public default LocalDateTime add(LocalDateTime date, int workdays) {
	    if (workdays < 1) {
	        return date;
	    }

	    LocalDateTime result = date;
	    int addedDays = 0;
	    while (addedDays < workdays) {
	        result = result.plusDays(1);
	        if (!(result.getDayOfWeek() == DayOfWeek.SATURDAY ||
	              result.getDayOfWeek() == DayOfWeek.SUNDAY)) {
	            ++addedDays;
	        }
	    }

	    return result;
	}
}
