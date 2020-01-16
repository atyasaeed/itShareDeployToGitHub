import { Injectable, Inject } from '@angular/core';
import { RestService } from './rest-service';
import { Order, ShoppingCartItem } from '../domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends RestService {
  resource = 'orders/cart';

  private ShoppingCartSubject: BehaviorSubject<ShoppingCartItem[]> = new BehaviorSubject<ShoppingCartItem[]>([]);
  public ShoppingCart: Observable<ShoppingCartItem[]> = this.ShoppingCartSubject.asObservable();

  refresh() {
  this.query<ShoppingCartItem[]>().subscribe(data => this.ShoppingCartSubject.next(data));
  return this.ShoppingCart;
}


  checkout() {
    return this.http.put<Order>(this.appConfig.CHECKOUT_URL, null);
  }
}
