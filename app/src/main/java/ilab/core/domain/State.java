package ilab.core.domain;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
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
	private String name;


	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}


}
