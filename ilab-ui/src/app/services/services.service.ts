import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '../domain';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Service[]>(`/services`);
  }

  get(id: number) {
    return this.http.get(`/service/${id}`);
  }
}
