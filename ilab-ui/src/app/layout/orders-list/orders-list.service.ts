import { Order } from './../../shared/domain/order.model';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root',
})
export class OrdersListService extends RestService<Order> {
  resource = 'admin/orders';

  updateLineItem(lineItem) {
    this.resource = 'admin/orders/lineItem';
    return this.update(lineItem);
  }
}
