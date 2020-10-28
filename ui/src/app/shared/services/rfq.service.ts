import { Injectable } from '@angular/core';
import { RestService } from '.';
import { LineItem, Order } from '../domain';

@Injectable({
  providedIn: 'root',
})
export class RFQService extends RestService<LineItem> {
  resource: string = 'quotation/rfqs';
}
