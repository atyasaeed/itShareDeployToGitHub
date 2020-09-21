package ilab.core.domain.user;

import java.util.Collection;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import ilab.core.domain.AbstractEntity;
@Entity
@Table(name = "users", uniqueConstraints =
{ @UniqueConstraint(columnNames = "email", name = "user_unique_email_idx"),
		@UniqueConstraint(columnNames = "username", name = "user_unique_username_idx")})
@JsonInclude(value = Include.NON_NULL)
public class User extends AbstractEntity<User>
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Size(min = 5, max = 100)
	@Column(nullable = false)
	@NotBlank
	private String username;
	@Email
	@Size(max = 100)
	@Column(nullable = false)
	@NotBlank
	private String email;
	@JsonProperty(access = Access.WRITE_ONLY)
	@NotBlank
	@Size(min = 5, max = 100)
	private String password;
	private String firstName;
	private String middleName;
	private String lastName;
	private String mobileNo;
	@Column(nullable = false, columnDefinition = " bool default true")
	private boolean enabled=true;
	private boolean accountNonLocked;
	private boolean accountNonExpired;
	private boolean credentialsNonExpired;
	@ElementCollection(fetch = FetchType.EAGER)
	@Enumerated(EnumType.STRING)
	@BatchSize(size = 200)
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	@Column(name = "role")
	private Set<Role> roles = EnumSet.noneOf(Role.class);
	
	
	private Locale locale=Locale.getDefault();
	
	@OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.PERSIST)
	private Organization defaultOrg;
	
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
		return accountNonExpired;
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
	public Set<Role> getRoles()
	{
		return roles;
	}

	public void setRoles(Collection<Role> roles)
	{
		this.roles = CollectionUtils.isEmpty(roles) ? EnumSet.noneOf(Role.class) : EnumSet.copyOf(roles);
	}

	public void addRole(Role role)
	{
		this.roles.add(role);
	}
	public String getMobileNo()
	{
		return mobileNo;
	}
	public void setMobileNo(String mobileNo)
	{
		this.mobileNo = mobileNo;
	}
	public Locale getLocale()
	{
		return locale;
	}
	public void setLocale(Locale locale)
	{
		this.locale = locale;
	}
	public Organization getDefaultOrg()
	{
		return defaultOrg;
	}
	public void setDefaultOrg(Organization defaultOrg)
	{
		this.defaultOrg = defaultOrg;
	}
	

}
