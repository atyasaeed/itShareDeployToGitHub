package ilab.dto;

import java.util.List;

import java.util.UUID;

import ilab.core.domain.HyperFile;
import ilab.core.domain.Service;
import ilab.core.domain.order.LineItemStatus;

public interface QuotationDto
{
	Service getService();

	List<HyperFile> getFiles();

	LineItemStatus getStatus();

	UUID getId();
}
