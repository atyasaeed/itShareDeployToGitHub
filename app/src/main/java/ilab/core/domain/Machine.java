package ilab.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class Machine extends AbstractEntity<Machine>
{
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private MachineStatus status;
	
}
