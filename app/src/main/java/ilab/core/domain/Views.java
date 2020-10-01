package ilab.core.domain;

import java.util.HashMap;
import java.util.Map;

import ilab.core.domain.user.Role;

public class Views
{
	public static final Map<Role, Class> MAPPING = new HashMap<>();

	static
	{
		MAPPING.put(Role.ROLE_ADMIN, Admin.class);
		MAPPING.put(Role.ROLE_USER, User.class);
		MAPPING.put(Role.ROLE_ANONYMOUS, Anonymous.class);
	}
	public static class Anonymous
	{

	}

	public static class User extends Anonymous
	{

	}

	public static class Admin extends User
	{

	}
}