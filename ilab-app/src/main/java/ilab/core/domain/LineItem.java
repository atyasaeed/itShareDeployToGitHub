package ilab.core.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Entity
@JsonInclude(value = Include.NON_NULL)
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
	
//	@Temporal(TemporalType.DATE)
	private LocalDateTime plannedStartDate;
//	@Temporal(TemporalType.DATE)
	private LocalDateTime plannedEndDate;
//	@Temporal(TemporalType.DATE)
	private LocalDateTime estimatedStardDate;
//	@Temporal(TemporalType.DATE)
	private LocalDateTime estimatedEndDate;
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
	
	
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	
	
	public List<HyperFile> getFiles()
	{
		return files;
	}
	public void setFiles(List<HyperFile> files)
	{
		this.files = files;
	}
	public LocalDateTime getPlannedStartDate()
	{
		return plannedStartDate;
	}
	public void setPlannedStartDate(LocalDateTime plannedStartDate)
	{
		this.plannedStartDate = plannedStartDate;
	}
	public LocalDateTime getPlannedEndDate()
	{
		return plannedEndDate;
	}
	public void setPlannedEndDate(LocalDateTime plannedEndDate)
	{
		this.plannedEndDate = plannedEndDate;
	}
	public LocalDateTime getEstimatedStardDate()
	{
		return estimatedStardDate;
	}
	public void setEstimatedStardDate(LocalDateTime estimatedStardDate)
	{
		this.estimatedStardDate = estimatedStardDate;
	}
	public LocalDateTime getEstimatedEndDate()
	{
		return estimatedEndDate;
	}
	public void setEstimatedEndDate(LocalDateTime estimatedEndDate)
	{
		this.estimatedEndDate = estimatedEndDate;
	}
}
