package ilab.core.domain.user;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority
{
	ANONYMOUS,ROLE_USER, ROLE_ADMIN,ROLE_CHANGE_PASSWORD_PRIVILEGE;

	@Override
	public String getAuthority()
	{
		return name();
	}
}