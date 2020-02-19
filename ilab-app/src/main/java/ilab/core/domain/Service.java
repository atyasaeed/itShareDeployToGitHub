package ilab.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;

@Entity
public class Service extends AbstractEntity<Service>
{
	@Column(unique = true)
	private String name;
	private String description;
	private int maxFiles;
	private String workingArea;
	@Lob
	@JsonProperty("materials")
	@JsonRawValue
	private String template;
	

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

	public String getTemplate()
	{
		return template;
	}

	public void setTemplate(String template)
	{
		this.template = template;
	}

	
}
