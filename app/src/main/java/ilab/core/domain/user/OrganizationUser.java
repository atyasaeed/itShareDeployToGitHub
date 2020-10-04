package ilab.core.domain.user;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import ilab.core.domain.AbstractEntity;
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "org_id" }) })
public class OrganizationUser extends AbstractEntity<OrganizationUser> {
	@ManyToOne
	private User user;
	@ManyToOne
	private Organization org;

	private Role status;

	public Role getStatus() {
		return status;
	}

	public void setStatus(Role status) {
		this.status = status;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Organization getOrg() {
		return org;
	}

	public void setOrg(Organization org) {
		this.org = org;
	}

}
//