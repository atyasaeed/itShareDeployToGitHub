import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderItem, Order } from 'src/app/shared/domain';
import { RestService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends RestService<Order> {
  resource: string = 'orders';
  approve(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/approve', null);
  }
  cancel(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/cancel', null);
  }
  reject(id: string) {
    return this.http.put<Order>(this.appConfig.getResourceUrl('orders') + '/' + id + '/reject', null);
  }
}