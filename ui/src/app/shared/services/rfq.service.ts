import { Injectable } from '@angular/core';
import { RestService } from '.';
import { RFQ } from '../domain/rfq.model ';

@Injectable({
  providedIn: 'root',
})
export class RFQService extends RestService<RFQ> {
  resource: string = 'quotation/rfqs';
}
