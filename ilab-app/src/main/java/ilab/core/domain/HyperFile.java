package ilab.core.domain;

import javax.persistence.CascadeType;
import javax.persistence.Embeddable;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

@Embeddable
public class HyperFile
{
	private String material;
	private String type;
	private String color;
	private String dimension;
	@OneToOne(cascade = CascadeType.PERSIST)
	@JsonUnwrapped(prefix = "asset_")
	private FileAsset asset;
	public String getMaterial()
	{
		return material;
	}
	public void setMaterial(String material)
	{
		this.material = material;
	}
	public String getType()
	{
		return type;
	}
	public void setType(String type)
	{
		this.type = type;
	}
	public String getColor()
	{
		return color;
	}
	public void setColor(String color)
	{
		this.color = color;
	}
	public String getDimension()
	{
		return dimension;
	}
	public void setDimension(String dimension)
	{
		this.dimension = dimension;
	}
	public FileAsset getAsset()
	{
		return asset;
	}
	public void setAsset(FileAsset asset)
	{
		this.asset = asset;
	}
}
