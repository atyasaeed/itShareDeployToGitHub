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
	private String arName;
	@NotNull
	@NotBlank
	@Size(min = 3, max = 250)
	private String enName;

	public String getArName()
	{
		return arName;
	}

	public void setArName(String arName)
	{
		this.arName = arName;
	}

	public String getEnName()
	{
		return enName;
	}

	public void setEnName(String enName)
	{
		this.enName = enName;
	}

	@ManyToOne
	private State state;

	public State getState()
	{
		return state;
	}

	public void setState(State state)
	{
		this.state = state;
	}

}
