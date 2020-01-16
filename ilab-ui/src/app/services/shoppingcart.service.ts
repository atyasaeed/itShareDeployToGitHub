import { Injectable } from '@angular/core';
import { RestService } from './rest-service';
import { Order } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends RestService {
  resource:string="orders/cart";
  checkout()
  {
    
    return this.http.put<Order>(this.appConfig.CHECKOUT_URL,null);
  }
  addCartItem(formData){
    return this.http.post<Order>(this.appConfig.getResourceUrl(this.resource),formData);
  }
}
