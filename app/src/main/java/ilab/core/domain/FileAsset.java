package ilab.core.domain;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ilab.core.domain.user.Organization;

@Entity
public class FileAsset extends AbstractEntity<FileAsset>
{
	private String name;
	@ManyToOne(optional=false)
	@JsonIgnore
	private Organization organization;

	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public Organization getOrganization()
	{
		return organization;
	}
	public void setOrganization(Organization organization)
	{
		this.organization = organization;
	}
	
}
