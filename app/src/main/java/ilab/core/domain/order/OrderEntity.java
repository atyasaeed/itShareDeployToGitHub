package ilab.core.domain.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.OrderColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ListIndexBase;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.Reason;
import ilab.core.domain.user.Organization;
import ilab.core.domain.user.User;
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
	private Organization organization;
	
	@ManyToOne(optional=false)
	private User placedBy;
	
	private BigDecimal totalCost;
	@Enumerated(EnumType.ORDINAL)
	@NotNull
	private OrderStatus status;
	@ManyToMany()
	Set<Reason> rejectionReasons=new HashSet<Reason>();
	@Column
	private LocalDateTime quotedAt;
	@Column
	private LocalDateTime expiredAt;
	private String rejectionNote;
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
	public Set<Reason> getRejectionReasons()
	{
		return rejectionReasons;
	}
	public void setRejectionReasons(Set<Reason> rejectionReasons)
	{
		this.rejectionReasons = rejectionReasons;
	}
	public String getRejectionNote()
	{
		return rejectionNote;
	}
	public void setRejectionNote(String rejectionNote)
	{
		this.rejectionNote = rejectionNote;
	}
	public LocalDateTime getQuotedAt()
	{
		return quotedAt;
	}
	public void setQuotedAt(LocalDateTime quotedAt)
	{
		this.quotedAt = quotedAt;
	}
	public LocalDateTime getExpiredAt()
	{
		return expiredAt;
	}
	public void setExpiredAt(LocalDateTime expiredAt)
	{
		this.expiredAt = expiredAt;
	}
	public Organization getOrganization()
	{
		return organization;
	}
	public void setOrganization(Organization organization)
	{
		this.organization = organization;
	}
}
