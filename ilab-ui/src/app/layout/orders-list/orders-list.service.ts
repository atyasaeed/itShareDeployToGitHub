import { Order } from './../../shared/domain/order.model';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root',
})
export class OrdersListService extends RestService<Order> {
  resource = 'admin/orders';
}
