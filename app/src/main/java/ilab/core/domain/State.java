package ilab.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class State extends AbstractEntity<State>
{
	@NotNull
	@NotBlank
	@Column(name = "name", unique = true)
	@Size(min = 3, max = 150)
	private String arName;

	@NotNull
	@NotBlank
	@Column(name = "name", unique = true)
	@Size(min = 3, max = 150)
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

}
