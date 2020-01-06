import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../domain';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root'
})

export class OrdersService extends RestService {
  resource:string="/orders";
}


export class TrackOrdersService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Order[]>(`/orders`);
  }

}
