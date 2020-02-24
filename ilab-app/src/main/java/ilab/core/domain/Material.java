package ilab.core.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;

@Entity
public class Material extends AbstractEntity<Material>
{
	private String name;
	@ManyToMany
	Set<MaterialType> types=new HashSet<MaterialType>();
	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Set<MaterialType> getTypes()
	{
		return types;
	}

	public void addType(MaterialType type)
	{
		this.types.add(type);
	}

	
	
	
}
