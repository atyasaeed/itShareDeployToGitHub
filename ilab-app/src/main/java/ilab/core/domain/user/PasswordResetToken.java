package ilab.core.domain.user;

import java.util.Date;
import java.util.Locale;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

import ilab.core.domain.AbstractEntity;
@Entity
public class PasswordResetToken extends AbstractEntity<PasswordResetToken>
{
	@OneToOne(fetch = FetchType.EAGER)
    private User user;
	private boolean used;
	private boolean sent;
	private Locale locale;
	private Date expiryDate;
	public User getUser()
	{
		return user;
	}

	public void setUser(User user)
	{
		this.user = user;
	}

	public Date getExpiryDate()
	{
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate)
	{
		this.expiryDate = expiryDate;
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

	public Locale getLocale()
	{
		return locale;
	}

	public void setLocale(Locale locale)
	{
		this.locale = locale;
	}


	

	
	
}
