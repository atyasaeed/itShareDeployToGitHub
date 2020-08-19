package ilab.core.domain.user;

import java.util.Locale;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

import ilab.core.domain.AbstractEntity;


@Entity
public class ActivationCode extends AbstractEntity<ActivationCode>
{
	@OneToOne(fetch = FetchType.EAGER)
    private User user;
	private String code;
	private boolean used;
	private boolean sent;
	private Locale locale;

	


	public User getUser()
	{
		return user;
	}

	public void setUser(User user)
	{
		this.user = user;
	}

	

	public boolean isUsed()
	{
		return used;
	}

	public void setUsed(boolean used)
	{
		this.used = used;
	}

	public boolean isSent()
	{
		return sent;
	}

	public void setSent(boolean sent)
	{
		this.sent = sent;
	}

	public String getCode()
	{
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public Locale getLocale()
	{
		return locale;
	}

	public void setLocale(Locale locale)
	{
		this.locale = locale;
	}

}
