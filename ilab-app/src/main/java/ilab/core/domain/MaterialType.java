package ilab.core.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;

@Entity
public class MaterialType extends AbstractEntity<MaterialType>
{
	private String name;
	@ElementCollection
	private Set<String> colors=new HashSet<String>();
	@ElementCollection
	private Set<String> dimensions=new HashSet<String>();

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Set<String> getDimensions()
	{
		return dimensions;
	}

	public void addDimension(String dimension)
	{
		this.dimensions.add(dimension);
	}

	public Set<String> getColors()
	{
		return colors;
	}

	public void addColor(String color)
	{
		this.colors.add(color);
	}
}
