import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../domain';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends RestService {
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
