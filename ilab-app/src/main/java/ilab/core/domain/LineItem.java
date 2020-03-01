package ilab.core.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

@Entity
public class LineItem extends AbstractEntity<LineItem>
{
	private int rank;
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private OrderEntity orderEntity;
	@ManyToOne(optional=false,fetch = FetchType.EAGER)
	private Service service;
	
	private long quantity;
	private BigDecimal unitPrice;
	
	@Temporal(TemporalType.DATE)
	private Date plannedStartDate;
	@Temporal(TemporalType.DATE)
	private Date plannedEndDate;
	@Temporal(TemporalType.DATE)
	private Date estimatedStardDate;
	@Temporal(TemporalType.DATE)
	private Date estimatedEndDate;
	private String notes;
	@ElementCollection
	private List<HyperFile> files=new ArrayList<HyperFile>();
	
	public long getQuantity()
	{
		return quantity;
	}
	public void setQuantity(long quantity)
	{
		this.quantity = quantity;
	}
	public int getRank()
	{
		return rank;
	}
	public void setRank(int rank)
	{
		this.rank = rank;
	}
	public OrderEntity getOrderEntity()
	{
		return orderEntity;
	}
	public void setOrderEntity(OrderEntity orderEntity)
	{
		this.orderEntity = orderEntity;
	}
	public Service getService()
	{
		return service;
	}
	public void setService(Service service)
	{
		this.service = service;
	}
	public BigDecimal getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(BigDecimal unitPrice)
	{
		this.unitPrice = unitPrice;
	}
	
	public Date getPlannedEndDate()
	{
		return plannedEndDate;
	}
	public void setPlannedEndDate(Date plannedEndDate)
	{
		this.plannedEndDate = plannedEndDate;
	}
	public Date getEstimatedStardDate()
	{
		return estimatedStardDate;
	}
	public void setEstimatedStardDate(Date estimatedStardDate)
	{
		this.estimatedStardDate = estimatedStardDate;
	}
	public Date getEstimatedEndDate()
	{
		return estimatedEndDate;
	}
	public void setEstimatedEndDate(Date estimatedEndDate)
	{
		this.estimatedEndDate = estimatedEndDate;
	}
	
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	
	public Date getPlannedStartDate()
	{
		return plannedStartDate;
	}
	public void setPlannedStartDate(Date plannedStartDate)
	{
		this.plannedStartDate = plannedStartDate;
	}
	public List<HyperFile> getFiles()
	{
		return files;
	}
	public void setFiles(List<HyperFile> files)
	{
		this.files = files;
	}
}
