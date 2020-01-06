import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../domain';

@Injectable({
  providedIn: 'root'
})

export class TrackOrdersService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Order[]>(`/orders`);
  }
}
