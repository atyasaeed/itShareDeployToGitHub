import { Injectable } from '@angular/core';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends RestService {
  resource:string="orders/cart";
}
