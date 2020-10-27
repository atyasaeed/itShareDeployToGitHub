package ilab.core.domain.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.FileAsset;
import ilab.core.domain.Service;

@Entity
@JsonInclude(value = Include.NON_NULL)
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
//	@OrderBy(value = "rank")
//	@OrderColumn(name = "rank")
//	@ListIndexBase(value = 1)
//	look at this issue https://www.intertech.com/Blog/hibernate-why-are-there-nulls-in-my-collection/
	private List<Service> services = new ArrayList<Service>();

	@OneToOne
	private FileAsset comReg;

	@OneToOne
	private FileAsset taxId;

	@OneToOne
	private FileAsset backNatId;

	@OneToOne
	private FileAsset frontNatId;

	@ManyToOne(optional = false)
	@JsonIgnoreProperties(value =
	{ "defaultOrg" })
	private User owner;

	private OrganizationType type;

	private OrganizationStatus status;
	private String statusReason;

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

	public OrganizationType getType()
	{
		return type;
	}

	public void setType(OrganizationType type)
	{
		this.type = type;
	}

	public OrganizationStatus getStatus()
	{
		return status;
	}

	public void setStatus(OrganizationStatus status)
	{
		this.status = status;
	}

	public String getStatusReason()
	{
		return statusReason;
	}

	public void setStatusReason(String statusReason)
	{
		this.statusReason = statusReason;
	}

	public FileAsset getComReg()
	{
		return comReg;
	}

	public void setComReg(FileAsset comReg)
	{
		this.comReg = comReg;
	}

	public FileAsset getTaxId()
	{
		return taxId;
	}

	public void setTaxId(FileAsset taxId)
	{
		this.taxId = taxId;
	}

	public FileAsset getBackNatId()
	{
		return backNatId;
	}

	public void setBackNatId(FileAsset backNatId)
	{
		this.backNatId = backNatId;
	}

	public FileAsset getFrontNatId()
	{
		return frontNatId;
	}

	public void setFrontNatId(FileAsset frontNatId)
	{
		this.frontNatId = frontNatId;
	}

}
