package ilab.core.domain.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.OrderColumn;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.ListIndexBase;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.Service;

@Entity
public class Organization extends AbstractEntity<Organization>
{
	@Size(min = 2, max = 80)
	@Column(nullable = false)
	@NotBlank
	private String name;
	private String website;

	@Size(min = 11, max = 18)
	@Column(nullable = false)
	@NotBlank
	private String mobileNo;

	@Size(min = 2, max = 80)
	@Column(nullable = false)
	@NotBlank

	private String city;
	@Size(min = 2, max = 80)
	@Column(nullable = false)
	@NotBlank

	private String address;
	
	@ManyToMany
	@OrderBy(value = "rank")
	@OrderColumn(name = "rank")
	@ListIndexBase(value = 1)
//	look at this issue https://www.intertech.com/Blog/hibernate-why-are-there-nulls-in-my-collection/
	private List<Service> services=new ArrayList<Service>();

	@ManyToOne(optional=false)
	@JsonIgnore
	private User owner ;
	
	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getWebsite()
	{
		return website;
	}

	public void setWebsite(String website)
	{
		this.website = website;
	}

	public String getMobileNo()
	{
		return mobileNo;
	}

	public void setMobileNo(String mobileNo)
	{
		this.mobileNo = mobileNo;
	}

	public String getCity()
	{
		return city;
	}

	public void setCity(String city)
	{
		this.city = city;
	}

	public String getAddress()
	{
		return address;
	}

	public void setAddress(String address)
	{
		this.address = address;
	}


	public User getOwner()
	{
		return owner;
	}

	public void setOwner(User owner)
	{
		this.owner = owner;
	}

	public List<Service> getServices()
	{
		return services;
	}

	public void setServices(List<Service> services)
	{
		this.services = services;
	}

	
}
