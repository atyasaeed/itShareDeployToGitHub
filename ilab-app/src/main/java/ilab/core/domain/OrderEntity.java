package ilab.core.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.OrderColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ListIndexBase;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
public class OrderEntity extends AbstractEntity<OrderEntity>
{
	@OneToMany(cascade=CascadeType.ALL,mappedBy="orderEntity",fetch = FetchType.LAZY)
	@OrderBy(value = "rank")
	@OrderColumn(name = "rank")
	@ListIndexBase(value = 1)
//	look at this issue https://www.intertech.com/Blog/hibernate-why-are-there-nulls-in-my-collection/
	@JsonIgnoreProperties("orderEntity")
	private List<LineItem> lineItems=new ArrayList<LineItem>();

	@ManyToOne(optional=false)
	@JsonIgnore
	private Account account;
	
	@ManyToOne(optional=false)
	@JsonIgnore
	private User placedBy;
	
	private BigDecimal totalCost;
	@Enumerated(EnumType.ORDINAL)
	@NotNull
	private OrderStatus status;
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
	public OrderStatus getStatus()
	{
		return status;
	}
	public void setStatus(OrderStatus type)
	{
		this.status = type;
	}
	public BigDecimal getTotalCost()
	{
		return totalCost;
	}
	public void setTotalCost(BigDecimal totalCost)
	{
		this.totalCost = totalCost;
	}
	
}
