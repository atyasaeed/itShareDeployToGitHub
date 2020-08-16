import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from 'src/app/shared/domain';
import { RestService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends RestService<Order> {
  resource: string = 'order';
  //searchUrl = 'advSearch';
  // getOrder(id: string) {
  //   return this.http.get<Order>(this.appConfig.getResourceUrl('orders') + '/' + id);
  // }
  approve(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/approveQuote', null);
  }
  cancel(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/cancel', null);
  }
  reject(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/rejectQuote', null);
  }

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
