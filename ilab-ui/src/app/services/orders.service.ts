import { Injectable } from '@angular/core';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends RestService {
  resource:string="/orders";
}
