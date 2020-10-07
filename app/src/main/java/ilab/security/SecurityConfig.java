package ilab.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import ilab.core.service.UserService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
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
		CookieCsrfTokenRepository csrf = CookieCsrfTokenRepository.withHttpOnlyFalse();
		csrf.setCookieHttpOnly(true);
		http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/login").permitAll()
				.antMatchers(HttpMethod.POST, "/login").permitAll()
				.antMatchers(HttpMethod.GET, "/*", "/ui/**", "/api/service/**", "/api/reason/**",
						"/api/user/resetPassword", "/api/user/activate", "/api/user/resendProvision",
						"/api/utils/initState", "/api/gallery/**", "/swagger-ui/**", "/v3/api-docs/**")
				.permitAll().antMatchers(HttpMethod.PUT, "/api/user/activate").permitAll()
				.antMatchers(HttpMethod.GET, "/api/city/search", "/api/state/search").permitAll()
//				.antMatchers(HttpMethod.PUT,"/api/user/**").authenticated()
				.antMatchers(HttpMethod.PUT, "/api/utils/lang").permitAll()
				.antMatchers(HttpMethod.POST, "/api/user", "/api/user/resetPassword").permitAll()

				.antMatchers(HttpMethod.POST, "/api/users/savePassword").hasAuthority("CHANGE_PASSWORD_PRIVILEGE")
				.antMatchers("/assets/**").permitAll().antMatchers("/digital-assets/**").permitAll().and()
				.authorizeRequests().anyRequest().authenticated().and().formLogin().loginProcessingUrl("/api/login")
				.failureHandler(customAuthenticationFailureHandler())
				.successHandler(customAuthenticationSuccessHandler()).and().logout().logoutUrl("/api/logout")
				.logoutSuccessHandler(new CustomLogoutSuccessHandler()).and().cors()
				.configurationSource(corsConfigurationSource()).and().csrf().disable()
//				.and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//				.and()
				.headers().frameOptions().sameOrigin().and().exceptionHandling()
				.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));

//			.and()
//			.exceptionHandling().authenticationEntryPoint(new Http403ForbiddenEntryPoint())

//		.ignoringAntMatchers("/login")
//		.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//		.and()

//		http
////		.exceptionHandling().authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
//		.csrf().disable()
//		.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//		.and()
//			.authorizeRequests()
//			.antMatchers("/api/**")
//			.fullyAuthenticated()
//		.and()
//			.authorizeRequests()
//			.antMatchers("/**")
//			.permitAll()
//		.and()
//			.cors()
//		.and()
//			.formLogin()

//		.and()
//			.httpBasic()

		;

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
	public AuthenticationFailureHandler customAuthenticationFailureHandler()
	{
		return new CustomAuthenticationFailureHandler();
	}

	@Bean
	public AuthenticationSuccessHandler customAuthenticationSuccessHandler()
	{
		return new CustomAuthenticationSuccessHandler();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource()
	{
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://localhost:5000"));
		configuration.setAllowCredentials(true);
		configuration.addAllowedHeader("*");
		configuration.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
