package ilab.core.domain.order;

public enum QuotationStatus
{

	QUOTED,SELECTED,REJECTED

}
/*
 * QuoteSent then(QUOTE_ACCEPTED_PARTNER OR QUOTE_REJECTED_PARTNER)
 * then(QUOTE_APPROVED_ADMIN OR QUOTE_REFUSED_ADMIN)if(approved)then(
 * (QUOTE_ACCEPTED_USER OR QUOTE_Rejected_USER
 */