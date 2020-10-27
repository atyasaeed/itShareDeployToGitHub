import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Quotation } from '../domain/quotation.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService extends RestService<Quotation> {
  resource = 'quotation';
}
