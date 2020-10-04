package ilab.core.domain.user;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import ilab.core.domain.AbstractEntity;

@Entity
@Table(uniqueConstraints =
{ @UniqueConstraint(columnNames =
		{ "user_id", "org_id" }) })
public class OrganizationUser extends AbstractEntity<OrganizationUser>
{
	@ManyToOne
	private User user;

	@ManyToOne
	private User placedBy;
	@ManyToOne
	private Organization org;

	private Role role;

	public Role getRole()
	{
		return role;
	}

	public void setRole(Role role)
	{
		this.role = role;
	}

	public User getUser()
	{
		return user;
	}

	public void setUser(User user)
	{
		this.user = user;
	}

	public Organization getOrg()
	{
		return org;
	}

	public void setOrg(Organization org)
	{
		this.org = org;
	}

	public User getPlacedBy()
	{
		return placedBy;
	}

	public void setPlacedBy(User placedBy)
	{
		this.placedBy = placedBy;
	}

}
//