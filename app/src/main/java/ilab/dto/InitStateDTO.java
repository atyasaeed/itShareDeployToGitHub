package ilab.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ilab.core.domain.Service;
import ilab.core.domain.order.OrderEntity;
@JsonInclude(value = Include.NON_NULL)
public class InitStateDTO
{
	private OrderEntity shoppingCart;
	private Iterable<Service> services;
	private Map<String, Object> user;
	private String lang;
	public Map<String, Object> getUser()
	{
		return user;
	}
	public void setUser(Map<String, Object> user)
	{
		this.user = user;
	}
	public OrderEntity getShoppingCart()
	{
		return shoppingCart;
	}
	public void setShoppingCart(OrderEntity shoppingCart)
	{
		this.shoppingCart = shoppingCart;
	}
	public Iterable<Service> getServices()
	{
		return services;
	}
	public void setServices(Iterable<Service> services)
	{
		this.services = services;
	}
	public String getLang()
	{
		return lang;
	}
	public void setLang(String lang)
	{
		this.lang = lang;
	}
}