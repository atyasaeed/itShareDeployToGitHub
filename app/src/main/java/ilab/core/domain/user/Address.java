package ilab.core.domain.user;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonView;

import ilab.core.domain.AbstractEntity;
import ilab.core.domain.City;
import ilab.core.domain.Views;

@Entity
public class Address extends AbstractEntity<Address>
{
	private String name;
	private String lineOne;
	private String lineTwo;
	private String phoneNo;

	@OneToOne
	private City city;
	@JsonView(Views.Admin.class)
	@ManyToOne
	private User user;

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

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

	public City getCity()
	{
		return city;
	}

	public void setCity(City city)
	{
		this.city = city;
	}

	public User getUser()
	{
		return user;
	}

	public void setUser(User user)
	{
		this.user = user;
	}

	public String getPhoneNo()
	{
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo)
	{
		this.phoneNo = phoneNo;
	}

}
