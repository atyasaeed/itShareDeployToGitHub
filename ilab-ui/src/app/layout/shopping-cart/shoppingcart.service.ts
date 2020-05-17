import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestService } from 'src/app/shared/services';
import { ShoppingCartItem, Order } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService extends RestService<ShoppingCartItem> {
  resource = 'cart';

  // private ShoppingCartSubject: BehaviorSubject<ShoppingCartItem[]> = new BehaviorSubject<ShoppingCartItem[]>([]);
  // public ShoppingCart: Observable<ShoppingCartItem[]> = this.ShoppingCartSubject.asObservable();

  // refresh() {
  //   // this.ShoppingCartItem[]>().subscribe((data) => this.ShoppingCartSubject.next(data));
  //   return this.ShoppingCart;
  // }
  // removeCart() {
  //   this.ShoppingCartSubject.next(null);
  //   return this.ShoppingCart;
  // }

  checkout() {
    return this.http.put<Order>(this.appConfig.CHECKOUT_URL, null);
  }
  // addCartItem(formData) {
  //   return this.http.post<Order>(this.appConfig.getResourceUrl(this.resource), formData);
  // }
  convertToGallery() {
    console.log(this.appConfig.API_END_POINT + 'api/admin/gallery');
    return this.http.put(this.appConfig.API_END_POINT + 'api/admin/gallery', '');
  }
}
