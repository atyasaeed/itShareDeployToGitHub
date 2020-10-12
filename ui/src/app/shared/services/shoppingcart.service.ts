import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestService } from 'src/app/shared/services';
import { ShoppingCartItem, Order } from 'src/app/shared/domain';
import { HttpClient } from '@angular/common/http';
import { IAppConfig, APP_CONFIG } from 'src/app/shared/app.config';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService extends RestService<ShoppingCartItem> {
  resource = 'cart';

  checkout(addressId: string) {
    return this.http.put<Order>(this.appConfig.CHECKOUT_URL + '/' + addressId, null);
  }

}
