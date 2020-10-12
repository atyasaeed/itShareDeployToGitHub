package ilab.core.domain.order;

import javax.persistence.Embeddable;
import javax.persistence.OneToOne;

import ilab.core.domain.City;

@Embeddable
public class OrderAddress
{
	private String lineOne;
	private String lineTwo;
	private String phoneNo;
	private String contactName;

	public String getLineOne()
	{
		return lineOne;
	}

	public void setLineOne(String lineOne)
	{
		this.lineOne = lineOne;
	}

	public String getLineTwo()
	{
		return lineTwo;
	}

	public void setLineTwo(String lineTwo)
	{
		this.lineTwo = lineTwo;
	}

	public String getPhoneNo()
	{
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo)
	{
		this.phoneNo = phoneNo;
	}

	public String getContactName()
	{
		return contactName;
	}

	public void setContactName(String contactName)
	{
		this.contactName = contactName;
	}

	@OneToOne
	private City city;

	public City getCity()
	{
		return city;
	}

	public void setCity(City city)
	{
		this.city = city;
	}

}
