package ilab.core.domain;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class FileAsset extends AbstractEntity<FileAsset>
{
	private String name;
	@ManyToOne(optional=false)
	@JsonIgnore
	private Account account;

	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public Account getAccount()
	{
		return account;
	}
	public void setAccount(Account account)
	{
		this.account = account;
	}
	
}
