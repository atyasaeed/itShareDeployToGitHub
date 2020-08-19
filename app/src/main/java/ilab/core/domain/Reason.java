package ilab.core.domain;

import javax.persistence.Entity;

@Entity
public class Reason extends AbstractEntity<Reason>
{
	private String name;
	private ReasonStatus status=ReasonStatus.DRAFT;
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public ReasonStatus getStatus()
	{
		return status;
	}
	public void setStatus(ReasonStatus status)
	{
		this.status = status;
	}
}
