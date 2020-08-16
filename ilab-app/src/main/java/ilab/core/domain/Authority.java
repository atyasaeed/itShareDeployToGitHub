package ilab.core.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import ilab.core.domain.user.User;

@Entity
@JsonIgnoreProperties(
        value = {"createdAt", "updatedAt","user"},
        allowGetters = true
)
public class Authority extends AbstractEntity<Authority>
{
	private String authority;
	@ManyToOne
	@JoinColumn(name="user_id",nullable = false)
	private User user;
	public String getAuthority()
	{
		return authority;
	}
	public void setAuthority(String authority)
	{
		this.authority = authority;
	}
	public User getUser()
	{
		return user;
	}
	public void setUser(User user)
	{
		this.user = user;
	}
	
}
