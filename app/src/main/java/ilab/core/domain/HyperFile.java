package ilab.core.domain;

import javax.persistence.CascadeType;
import javax.persistence.Embeddable;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.JsonNode;

@Embeddable
@JsonInclude(value = Include.NON_NULL)
public class HyperFile
{
	private String material;
	private String type;
	private String color;
	private String height;
	private String width;
	private String thickness;
	private String unit;
	@JsonRawValue
	private String processes;
	
	
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
	
	public FileAsset getAsset()
	{
		return asset;
	}
	public void setAsset(FileAsset asset)
	{
		this.asset = asset;
	}
	public String getHeight()
	{
		return height;
	}
	public void setHeight(String height)
	{
		this.height = height;
	}
	public String getWidth()
	{
		return width;
	}
	public void setWidth(String width)
	{
		this.width = width;
	}
	public String getThickness()
	{
		return thickness;
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}
	public String getUnit()
	{
		return unit;
	}
	public void setUnit(String unit)
	{
		this.unit = unit;
	}
	public String getProcesses()
	{
		return processes;
	}
	public void setProcesses(String processes)
	{
		this.processes = processes;
	}
	@JsonSetter("processes")
	public void setProcesses(JsonNode node)
	{
		this.processes=node.toString();
	}
}
