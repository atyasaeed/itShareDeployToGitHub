package ilab.core.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import ilab.core.domain.State;

public interface StateRepository extends PagingAndSortingRepository<State, UUID>, JpaSpecificationExecutor<State>
{
}
