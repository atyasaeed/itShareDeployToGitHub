package ilab.core.domain;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;

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
//	@Lob
	@JsonProperty("materials")
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String template;
	
//	@Lob
	@JsonProperty("supportedExtensions")
	@JsonRawValue
	@Column(columnDefinition = "TEXT",length = 1024)
	@Basic(fetch = FetchType.EAGER)
	private String extensions;
	
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
	@JsonSetter("materials")
	public void setTemplate(JsonNode node)
	{
		this.template=node.toString();
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
	
}
