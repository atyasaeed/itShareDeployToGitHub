package ilab.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class Service extends AbstractEntity<Service>
{
	@Column(unique = true)
	private String name;
	private String description;

	

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}
	

}
