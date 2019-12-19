package ilab.core.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;

public class OrderEntity extends AbstractEntity<OrderEntity>
{
	@OneToMany(cascade=CascadeType.ALL, orphanRemoval=true,mappedBy="orderEntity")
	@OrderColumn(name="rank",nullable=false)
	private List<LineItem> lineItems=new ArrayList<LineItem>();
	private Account account;
	private User placedBy;
}
