package ilab.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class City extends AbstractEntity<City>
{

	@NotNull
	@NotBlank
	@Size(min = 3, max = 250)
	private String name;

	@ManyToOne
	private State governorate;

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public State getGovernorate()
	{
		return governorate;
	}

	public void setGovernorate(State governorate)
	{
		this.governorate = governorate;
	}

}
