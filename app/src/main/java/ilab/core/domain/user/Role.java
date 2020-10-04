package ilab.core.domain.user;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority
{
	ROLE_ANONYMOUS,ROLE_USER, ROLE_ADMIN,ROLE_CHANGE_PASSWORD_PRIVILEGE,ROLE_REGISTER_PRIVILEGE,ROLE_OWNER,ROLE_MEMBER,ROLE_INVITED;

	@Override
	public String getAuthority()
	{
		return name();
	}
}