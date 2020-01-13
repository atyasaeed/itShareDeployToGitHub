package ilab.core.domain;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "userInfo")
public class User extends AbstractEntity<User>
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
	private boolean accountNonExpired;
	private boolean credentialsNonExpired;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user",fetch = FetchType.EAGER)
	  private Set<Authority> authorities = new HashSet<>();
	
	public void setPassword(String password)
	{
		this.password = password;
	}
	public String getPassword()
	{
		return password;
	}
	public void setUsername(String username)
	{
		this.username = username;
	}
	public String getUsername()
	{
		return username;
	}
	public void setAccountNonExpired(boolean accountNonExpired)
	{
		this.accountNonExpired = accountNonExpired;
	}
	public boolean isAccountNonExpired()
	{
		return true;
	}
	public void setAccountNonLocked(boolean accountNonLocked)
	{
		this.accountNonLocked = accountNonLocked;
	}
	public boolean isAccountNonLocked()
	{
		return accountNonLocked;
	}
	
	public void setCredentialsNonExpired(boolean credentialsNonExpired)
	{
		this.credentialsNonExpired = credentialsNonExpired;
	}
	public boolean isCredentialsNonExpired()
	{
		return credentialsNonExpired;
	}
	public void setEnabled(boolean enabled)
	{
		this.enabled = enabled;
	}
	public boolean isEnabled()
	{
		return enabled;
	}
	public String getEmail()
	{
		return email;
	}
	public void setEmail(String email)
	{
		this.email = email;
	}
	public String getFirstName()
	{
		return firstName;
	}
	public void setFirstName(String firstName)
	{
		this.firstName = firstName;
	}
	public String getMiddleName()
	{
		return middleName;
	}
	public void setMiddleName(String middleName)
	{
		this.middleName = middleName;
	}
	public String getLastName()
	{
		return lastName;
	}
	public void setLastName(String lastName)
	{
		this.lastName = lastName;
	}
	public Set<Authority> getAuthorities()
	{
		return authorities;
	}
	public void addAuthority(Authority authority)
	{
		this.authorities.add(authority);
	}
	

}
