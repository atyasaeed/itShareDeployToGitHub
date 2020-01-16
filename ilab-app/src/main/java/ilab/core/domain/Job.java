package ilab.core.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Job extends AbstractEntity<Job>
{
	@OneToOne
	private LineItem lineItem;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false)
	private Machine machine;
	
	private JobStatus status;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable=false)
	private Date start;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable=false)
	private Date finished;
}
