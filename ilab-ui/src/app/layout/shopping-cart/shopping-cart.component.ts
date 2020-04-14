import { Component, OnInit, Inject } from '@angular/core';
import { ShoppingCartItem } from 'src/app/shared/domain';
import { ShoppingCartService } from './shoppingcart.service';
import { Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService>
  implements OnInit {
  lang: string;
  loading = false;
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
  }

  subTotal: any;
  ngOnInit() {
    super.ngOnInit();

    // this.refresh();
  }
  // deletItem(id) {
  //   this.loading = true;
  //   this.service.delete<ShoppingCartItem>(id).subscribe(
  //     (resp) => {
  //       this.refresh();
  //       this.loading = false;
  //     },
  //     (err) => {
  //       this.loading = false;
  //     }
  //   );
  // }

  delete(entity) {
    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  checkout() {
    //   this.service.checkout().subscribe((resp) => {
    //     this.refresh();
    //   });
    // }
    // private refresh() {
    //   this.service.refresh().subscribe((items) => (this.items = items));
  }
  updateItem(item: ShoppingCartItem) {
    this.loading = true;
    this.service.update(item).subscribe(
      (res) => {
        // this.refresh();
        this.loading = false;
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

  public getSubTotal() {
    // return this.items.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
    return 0;
  }
}
