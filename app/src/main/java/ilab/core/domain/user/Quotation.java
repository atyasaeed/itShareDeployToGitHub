package ilab.core.domain.user;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonFormat;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.order.LineItem;

@Entity
@Table(uniqueConstraints =
{ @UniqueConstraint(columnNames =
		{ "line_item_id", "org_id" }) })
public class Quotation extends AbstractEntity<Quotation>
{

	@ManyToOne
	private LineItem lineItem;

	@OneToOne
	private User placedBy;

	@OneToOne
	private Organization org;

	private BigDecimal unitPrice;

	private QuotationStatus status;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date endDate;

	public BigDecimal getUnitPrice()
	{
		return unitPrice;
	}

	public void setUnitPrice(BigDecimal unitPrice)
	{
		this.unitPrice = unitPrice;
	}

	public LineItem getLineItem()
	{
		return lineItem;
	}

	public void setLineItem(LineItem lineItem)
	{
		this.lineItem = lineItem;
	}

	public User getPlacedBy()
	{
		return placedBy;
	}

	public void setPlacedBy(User placedBy)
	{
		this.placedBy = placedBy;
	}

	public Organization getOrg()
	{
		return org;
	}

	public void setOrg(Organization org)
	{
		this.org = org;
	}

	public QuotationStatus getStatus()
	{
		return status;
	}

	public void setStatus(QuotationStatus status)
	{
		this.status = status;
	}

	public Date getEndDate()
	{
		return endDate;
	}

	public void setEndDate(Date endDate)
	{
		this.endDate = endDate;
	}

}
