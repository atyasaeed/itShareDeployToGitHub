package ilab.core.domain;

import java.util.Arrays;
import java.util.Collection;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "userInfo")
public class User extends AbstractEntity<User> implements UserDetails
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(unique = true)
	private String username;
	@Column(unique = true)
	private String email;
	private String password;
	private String firstName;
	private String middleName;
	private String lastName;
	private boolean enabled;
	private boolean accountNonLocked;
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities()
	{
		// TODO Auto-generated method stub
		return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
	}
	public void setPassword(String password)
	{
		this.password = password;
	}
	@Override
	public String getPassword()
	{
		return password;
	}
	public void setUsername(String username)
	{
		this.username = username;
	}
	@Override
	public String getUsername()
	{
		return username;
	}
	@Override
	public boolean isAccountNonExpired()
	{
		// TODO Auto-generated method stub
		return true;
	}
	public void setAccountNonLocked(boolean accountNonLocked)
	{
		this.accountNonLocked = accountNonLocked;
	}
	@Override
	public boolean isAccountNonLocked()
	{
		return accountNonLocked;
	}
	@Override
	public boolean isCredentialsNonExpired()
	{
		// TODO Auto-generated method stub
		return true;
	}
	public void setEnabled(boolean enabled)
	{
		this.enabled = enabled;
	}
	@Override
	public boolean isEnabled()
	{
		return enabled;
	}

}
