package ilab.core.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class LineItem extends AbstractEntity<LineItem>
{
	private int rank;
	@ManyToOne(optional = false)
	private OrderEntity orderEntity;
	@ManyToOne(optional=false)
	private Service service;
	private String digtalAssets;
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
	private String color;
	private String material;
	private String projectType;
	private String notes;
	private String unit;
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
	public String getDigtalAssets()
	{
		return digtalAssets;
	}
	public void setDigtalAssets(String digtalAssets)
	{
		this.digtalAssets = digtalAssets;
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
	public String getColor()
	{
		return color;
	}
	public void setColor(String color)
	{
		this.color = color;
	}
	public String getMaterial()
	{
		return material;
	}
	public void setMaterial(String material)
	{
		this.material = material;
	}
	public String getProjectType()
	{
		return projectType;
	}
	public void setProjectType(String projectType)
	{
		this.projectType = projectType;
	}
	public String getNotes()
	{
		return notes;
	}
	public void setNotes(String notes)
	{
		this.notes = notes;
	}
	public String getUnit()
	{
		return unit;
	}
	public void setUnit(String unit)
	{
		this.unit = unit;
	}
	public Date getPlannedStartDate()
	{
		return plannedStartDate;
	}
	public void setPlannedStartDate(Date plannedStartDate)
	{
		this.plannedStartDate = plannedStartDate;
	}
	


}
