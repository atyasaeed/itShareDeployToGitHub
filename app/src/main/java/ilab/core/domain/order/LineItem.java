package ilab.core.domain.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.HyperFile;
import ilab.core.domain.Reason;
import ilab.core.domain.Service;

@Entity
@JsonInclude(value = Include.NON_NULL)
public class LineItem extends AbstractEntity<LineItem>
{
	private int rank;
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private OrderEntity orderEntity;
	@ManyToOne(optional = false, fetch = FetchType.EAGER)
	private Service service;

	private long quantity;
	private BigDecimal unitPrice;

	@ElementCollection
	private List<HyperFile> files = new ArrayList<HyperFile>();
	@Enumerated(EnumType.ORDINAL)
	@NotNull
	private LineItemStatus status = LineItemStatus.PENDING;

	@ManyToMany()
	Set<Reason> rejectionReasons = new HashSet<Reason>();
	private String rejectionNote;
	private LocalDateTime estimatedStartDate;
	private int duration;
	private String notes;
	@OneToOne
	private Quotation selected;
	

	public Quotation getSelected()
	{
		return selected;
	}

	public void setSelected(Quotation quotation)
	{
		this.selected = quotation;
	}

	public int getDuration()
	{
		return duration;
	}

	public void setDuration(int duration)
	{
		this.duration = duration;
	}

	

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

	public LocalDateTime getEstimatedStartDate()
	{
		return estimatedStartDate;
	}

	public void setEstimatedStartDate(LocalDateTime estimatedStartDate)
	{
		this.estimatedStartDate = estimatedStartDate;
	}

	public LineItemStatus getStatus()
	{
		return status;
	}

	public void setStatus(LineItemStatus status)
	{
		this.status = status;
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
}
