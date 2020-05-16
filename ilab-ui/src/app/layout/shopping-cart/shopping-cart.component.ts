import { Component, OnInit, Inject } from '@angular/core';
import { ShoppingCartItem } from 'src/app/shared/domain';
import { ShoppingCartService } from './shoppingcart.service';
import { Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  animations: [routerTransition()],
})
export class ShoppingCartComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService>
  implements OnInit {
  breadcrumbs = [{ heading: 'Cart', icon: 'fa-tasks' }];
  lang: string;
  loading = false;
  subTotal = 0;
  items$;
  // quantitiesCount;

  // items: Array<ShoppingCartItem>;
  constructor(
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) {
    super(service);

    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });

    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      console.log(res);
      this.items$ = res.lineItems;
      this.subTotal = res.lineItems.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
      // this.quantitiesCount = res.lineItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      // console.log(this.quantitiesCount);
    });
  }

  // subTotal: any;
  ngOnInit() {
    // super.ngOnInit();
    // this.entities$.subscribe((items) => {
    //   console.log(items);
    //   this.subTotal = items.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
    // });
  }

  delete(entity) {
    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  checkout() {
    this.service.checkout().subscribe((resp) => {
      this.service.searchTerm = '';
      // this.refresh();
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  updateItem(item: ShoppingCartItem) {
    this.loading = true;
    this.service.update(item).subscribe(
      (res) => {
        this.loading = false;
        this.service.searchTerm = '';
        // this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  // removeCart() {
  //   this.service.removeCart().subscribe();
  // }
  getImageUrl(entity: ShoppingCartItem): string {
    return this.appConfig.ASSETS_URL + entity.service.id;
  }

  // checkItems() {
  //   if (this.items.length === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  getFileUrl(entity: ShoppingCartItem, fileIndex): string {
    return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
  }

  // public getSubTotal(): Observable<number> {
  //   // return this.items.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   let subTotal;
  //   this.entities$.subscribe((res) => {
  //     subTotal = res.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   });
  //   return subTotal;
  // }
}
