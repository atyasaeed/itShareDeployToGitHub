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
	private long units;
	private BigDecimal unitPrice;
	@Temporal(TemporalType.DATE)
	private Date plannedStardDate;
	@Temporal(TemporalType.DATE)
	private Date plannedEndDate;
	@Temporal(TemporalType.DATE)
	private Date estimatedStardDate;
	@Temporal(TemporalType.DATE)
	private Date estimatedEndDate;


}
