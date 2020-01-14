package ilab.core.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
public class OrderEntity extends AbstractEntity<OrderEntity>
{
	@OneToMany(cascade=CascadeType.ALL,mappedBy="orderEntity",fetch = FetchType.LAZY)
	@OrderColumn(name="rank",nullable=false)
	@JsonIgnoreProperties("orderEntity")
	private Set<LineItem> lineItems=new HashSet<LineItem>();

	@ManyToOne(optional=false)
	@JsonIgnore
	private Account account;
	
	@ManyToOne(optional=false)
	@JsonIgnore
	private User placedBy;
	
	@Enumerated(EnumType.ORDINAL)
	@NotNull
	private OrderType type;
	public Set<LineItem> getLineItems()
	{
		return lineItems;
	}
	public void addLineItem(LineItem lineItem)
	{
		this.lineItems.add(lineItem);
	}
	public void setLineItems(Set<LineItem> lineItems)
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
