package ilab.api;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/login",produces = "application/json")
@CrossOrigin(origins = "*", maxAge = 3600,
//allowedHeaders={"x-auth-token", "x-requested-with", "x-xsrf-token"  
//			,"origin, content-type, accept, x-requested-with","Authorization"})
allowedHeaders = {"*"})

public class UserController
{
	@GetMapping
	public ResponseEntity<Principal>  recentServices(Principal user)
	{
		if(user!=null)
			return new ResponseEntity<Principal>(user, HttpStatus.OK);
		return new ResponseEntity<Principal>(HttpStatus.UNAUTHORIZED);
	}
}
