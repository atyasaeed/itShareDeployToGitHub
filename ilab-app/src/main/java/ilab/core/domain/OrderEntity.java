package ilab.core.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
public class OrderEntity extends AbstractEntity<OrderEntity>
{
	@OneToMany(cascade=CascadeType.ALL, orphanRemoval=true,mappedBy="orderEntity")
	@OrderColumn(name="rank",nullable=false)
	@JsonIgnoreProperties("orderEntity")
	private List<LineItem> lineItems=new ArrayList<LineItem>();
	@ManyToOne(optional=false)
	@JsonIgnore
	private Account account;
	@ManyToOne(optional=false)
	@JsonIgnore
	private User placedBy;
	@Enumerated(EnumType.ORDINAL)
	@NotNull
	private OrderType type;
	public List<LineItem> getLineItems()
	{
		return lineItems;
	}
	public void addLineItem(LineItem lineItem)
	{
		this.lineItems.add(lineItem);
	}
	public void setLineItems(List<LineItem> lineItems)
	{
		this.lineItems = lineItems;
	}
	public Account getAccount()
	{
		return account;
	}
	public void setAccount(Account account)
	{
		this.account = account;
	}
	public User getPlacedBy()
	{
		return placedBy;
	}
	public void setPlacedBy(User placedBy)
	{
		this.placedBy = placedBy;
	}
	public OrderType getType()
	{
		return type;
	}
	public void setType(OrderType type)
	{
		this.type = type;
	}
	
}
