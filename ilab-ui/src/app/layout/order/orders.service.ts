import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderItem, Order } from 'src/app/shared/domain';
import { RestService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends RestService<Order> {
  resource: string = 'orders';
  //searchUrl = 'advSearch';
  // getOrder(id: string) {
  //   return this.http.get<Order>(this.appConfig.getResourceUrl('orders') + '/' + id);
  // }
  approve(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/approveQuote', null);
  }
  cancel(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/cancel', null);
  }
  reject(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/rejectQuote', null);
  }
}
