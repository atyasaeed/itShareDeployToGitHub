package ilab.core.repository;

import java.util.UUID;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ilab.core.domain.Service;

@Repository
@Transactional(value = TxType.SUPPORTS)
public interface ServiceRepository extends PagingAndSortingRepository<Service, UUID>
{
	

}
