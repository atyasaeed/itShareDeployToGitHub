import { Order } from './../../shared/domain/order.model';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { RejectionReason } from 'src/app/shared/domain/reason.model';
@Injectable({
  providedIn: 'root',
})
export class OrdersListService extends RestService<Order> {
  resource = 'admin/orders';

  updateLineItem(lineItem) {
    // return this.http.put('http://18.215.58.131:8080/api/admin/orders/lineItem', lineItem);
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + '/lineItem', lineItem);
  }
  orderReject(id, rejectionReason: Order) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/rejectOrder`, rejectionReason);
  }
  orderStatus(id, action) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/${action}`, '');
  }
}
