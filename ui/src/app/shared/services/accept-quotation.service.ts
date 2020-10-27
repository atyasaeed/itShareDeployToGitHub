import { Injectable } from '@angular/core';
import { RestService } from '.';
import { Quotation } from '../domain/quotation.model';

@Injectable({
  providedIn: 'root',
})
export class AcceptQuotationService extends RestService<Quotation> {
  resource: string = 'quotation';
}
