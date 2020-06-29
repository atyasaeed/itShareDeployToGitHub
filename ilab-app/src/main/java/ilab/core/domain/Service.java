package ilab.core.domain;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;

@Entity
public class Service extends AbstractEntity<Service>
{
	@Column(unique = true)
	private String name;
	private String description;
	private int maxFiles;
	private String workingArea;
	private boolean attendance;
	private String pricing;
	private String image;
	@JsonRawValue
	private String units;
//	@Lob
	@JsonProperty("supportedExtensions")
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String extensions;
	
	
//	@Lob
//	@JsonProperty("materials")
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String materials;
	
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String thickness;

	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String colors;
	
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String processes;;
	
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

	public int getMaxFiles()
	{
		return maxFiles;
	}

	public void setMaxFiles(int maxFiles)
	{
		this.maxFiles = maxFiles;
	}

	public String getWorkingArea()
	{
		return workingArea;
	}

	public void setWorkingArea(String workingArea)
	{
		this.workingArea = workingArea;
	}

	public String getMaterials()
	{
		return materials;
	}

	public void setMaterials(String materials)
	{
		this.materials = materials;
	}
	@JsonSetter("materials")
	public void setMaterials(JsonNode node)
	{
		this.materials=node.toString();
	}
	public String getExtensions()
	{
		return extensions;
	}

	public void setExtensions(String extensions)
	{
		this.extensions = extensions;
	}

	@JsonSetter("supportedExtensions")
	public void setExtensions(JsonNode node)
	{
		this.extensions=node.toString();
	}

	public boolean isAttendance()
	{
		return attendance;
	}

	public void setAttendance(boolean attendance)
	{
		this.attendance = attendance;
	}

	public String getUnits()
	{
		return units;
	}

	public void setUnits(String units)
	{
		this.units = units;
	}
	@JsonSetter("units")
	public void setUnits(JsonNode node)
	{
		this.units=node.toString();
	}

	public String getPricing()
	{
		return pricing;
	}

	public void setPricing(String pricing)
	{
		this.pricing = pricing;
	}

	public String getThickness()
	{
		return thickness;
	}
	@JsonSetter("thickness")
	public void setThickness(JsonNode node)
	{
		this.thickness=node.toString();
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}

	public String getColors()
	{
		return colors;
	}

	public void setColors(String colors)
	{
		this.colors = colors;
	}
	@JsonSetter("colors")
	public void setColors(JsonNode node)
	{
		this.colors=node.toString();
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

	public String getImage()
	{
		return image;
	}

	public void setImage(String image)
	{
		this.image = image;
	}
}
