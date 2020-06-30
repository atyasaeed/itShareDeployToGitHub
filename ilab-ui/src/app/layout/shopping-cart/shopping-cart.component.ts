import { ToastrService } from 'ngx-toastr';
import { User } from '../../shared/domain/user.model';
import { Component, OnInit, Inject } from '@angular/core';
import { ShoppingCartItem, Order, LineItem } from 'src/app/shared/domain';
import { ShoppingCartService } from './shoppingcart.service';
import { Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerTransition } from 'src/app/router.animations';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';

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
  newCart: Order;
  authUser$: Observable<User>;
  hasAdminRole = false;
  // quantitiesCount;

  // items: Array<ShoppingCartItem>;
  constructor(
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    super(service);
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    console.log(this.appConfig);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });

    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      // console.log(res);
      this.items$ = res?.lineItems;
      this.subTotal = res?.lineItems.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
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
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
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
  convertToGallery() {
    this.service.convertToGallery().subscribe((res) => {
      this.toastr.success('Successful Addition To Gallery');
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  updateItem(item: ShoppingCartItem, quantity) {
    let newItem = Object.assign({}, item);
    newItem.quantity = quantity;
    // console.log(newItem);
    // console.log(this.items$);
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        // this.service.searchTerm = '';
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
      }
    );

    // this.appStore.dispatch(new fromStore.UpdateLineItemQuantity(newItem));
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
  materialChange(item: LineItem, event) {
    //console.log(event.target.value);
    let newItem = JSON.parse(JSON.stringify(item));
    console.log(event.target.value);
    //let newItem = { ...item };
    // console.log(newItem);
    // console.log(this.items$);
    //newItem.files.
    //item.quantity = 5;
    //newItem.files[0].material = 'metal';
    //console.log(newItem);
    //console.log(newItem);
    //console.log(JSON.stringify(newItem));
    //console.log(newItem);
    //newItem.files[0].material = event.target.value;
    //console.log(newItem);
    this.service.update(newItem).subscribe((res) => {
      //this.loading = false;
      // this.service.searchTerm = '';
      //console.log(res);
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
}
