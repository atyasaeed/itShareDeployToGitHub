package ilab.core.domain;

import com.fasterxml.jackson.annotation.JsonView;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Version;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@MappedSuperclass
public abstract class AbstractEntity<T extends AbstractEntity<?>>
{
	@Id
	@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
	@GeneratedValue(generator = "UUID")
	private UUID id;

	@Column(nullable = false)
	private LocalDateTime created;

	@Column(nullable = false)
	@JsonView(Views.Admin.class)
	private LocalDateTime updated;
	@Version
	@JsonView(Views.Admin.class)
	private long version;

	@PrePersist
	protected void onCreate()
	{
		updated = created = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate()
	{
		updated = LocalDateTime.now();
	}

	public UUID getId()
	{
		return id;
	}

	public T setId(UUID id)
	{
		this.id = id;
		return (T) this;
	}

	public long getVersion()
	{
		return version;
	}

	public void setVersion(long version)
	{
		this.version = version;
	}

	public LocalDateTime getCreated()
	{
		return created;
	}

	public void setCreated(LocalDateTime created)
	{
		this.created = created;
	}

	public LocalDateTime getUpdated()
	{
		return updated;
	}

	public void setUpdated(LocalDateTime updated)
	{
		this.updated = updated;
	}
}
