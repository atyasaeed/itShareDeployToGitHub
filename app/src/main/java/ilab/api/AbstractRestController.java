package ilab.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.sipios.springsearch.anotation.SearchSpec;



public interface AbstractRestController<T,K>
{
	@GetMapping("search")
	public Page<T> getPageable(Pageable page, @SearchSpec Specification<T> specs,Authentication auth);
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public T create(@RequestBody T entity,Authentication auth);
	@PutMapping
	public T update(@RequestBody T entity,Authentication auth);
	@DeleteMapping(path = "/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable("id") K id,Authentication authentication);
	@GetMapping(path = "/{id}")
	public T get(@PathVariable("id") K id,Authentication authentication);
}

