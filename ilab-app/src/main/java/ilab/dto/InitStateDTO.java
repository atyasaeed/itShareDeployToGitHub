package ilab.dto;

import java.util.Map;

import ilab.core.domain.OrderEntity;

public class InitStateDTO
{
	private OrderEntity shoppingCart;
	private Map<String, Object> user;
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
	
}
