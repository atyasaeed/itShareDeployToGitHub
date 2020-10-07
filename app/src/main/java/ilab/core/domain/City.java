package ilab.core.domain;

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
	private State state;



	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public State getState()
	{
		return state;
	}

	public void setState(State state)
	{
		this.state = state;
	}

}
