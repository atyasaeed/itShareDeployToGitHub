package ilab.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import ilab.core.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Autowired
	private UserService userService;
	@Bean
	public PasswordEncoder encoder()
	{
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
//		return new StandardPasswordEncoder("53cr3t");
	}
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception
	{
		auth.userDetailsService(userService).passwordEncoder(encoder());
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.csrf().disable()
		.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
		.and()
			.authorizeRequests()
			.antMatchers("/**")
			.fullyAuthenticated()
		.and()
			.httpBasic();
		

//		http
//			.csrf().disable()
//				.authorizeRequests()
//				.antMatchers("/authenticate")
//				.permitAll()
//				.antMatchers(HttpMethod.OPTIONS,"/authenticate")
//				.permitAll()
//			.and()
//				.authorizeRequests()
//				.antMatchers("/**")
//				.fullyAuthenticated()
//		.and()
//			.httpBasic()
//		.and()
//			.formLogin().loginPage("/login")
//			.loginProcessingUrl("/authenticate")
//			.defaultSuccessUrl("/")
//			;
//		http
//		.csrf().disable()
//		.cors().disable()
//			.authorizeRequests()
//			.antMatchers(HttpMethod.OPTIONS,"/**").permitAll()
////			.antMatchers(HttpMethod.POST).permitAll()
////			.antMatchers("/design","/orders/**")
////				.permitAll()
////				.hasRole("USER")
//			.antMatchers("/static/**").permitAll()
//				
//////			.and()
//////				.formLogin().loginPage("/login")
//////				.loginProcessingUrl("/authenticate")
//////				.defaultSuccessUrl("/design")
////				
////			.and()
////				.logout().logoutSuccessUrl("/login")
//			.and()
//				.headers().frameOptions().sameOrigin()
//			.and()
//				.csrf().ignoringAntMatchers("/h2-console/**")
//			.and()
////				.csrf().disable()
//				.csrf()
//				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//
//				;
	}
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("*"));
		configuration.addAllowedHeader("*");
		configuration.setAllowedMethods(Arrays.asList("GET","POST","OPTIONS"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
