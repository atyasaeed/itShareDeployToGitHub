import { ToastrService } from 'ngx-toastr';
import { User } from '../../shared/domain/user.model';
import { Component, OnInit, Inject, ElementRef, TemplateRef } from '@angular/core';
import { ShoppingCartItem, Order, LineItem } from 'src/app/shared/domain';
import { ShoppingCartService } from '../../shared/services/shoppingcart.service';
//import { Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerTransition } from 'src/app/router.animations';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { debounce, debounceTime, switchMap, delay } from 'rxjs/operators';

import { TdLoadingService } from '@covalent/core/loading';
import { GalleryService } from 'src/app/shared/services/gallery.service';
//import { animate } from '@angular/animations';
//import { BsModalService, BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  animations: [routerTransition()],
})
export class ShoppingCartComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService>
  implements OnInit {
  breadcrumbs = [{ heading: 'cart', icon: 'fa-tasks' }];
  lang: string;
  loading = false;
  subTotal = 0;
  items: LineItem[];
  newCart: Order;
  authUser$: Observable<User>;
  hasAdminRole = false;
  dropdownSettings: IDropdownSettings = {};
  // quantitiesCount;
  selectedItemsArray;
  //test = true;

  //test: string[] = ['assets/images/teapot.stl'];
  // items: Array<ShoppingCartItem>;
  constructor(
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService,
    private galleryService: GalleryService
  ) {
    super(service, loadingService);
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    //console.log(this.appConfig);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });

    this.dropdownSettings = {
      singleSelection: false,
      //idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      // console.log(res);
      //console.log(res?.lineItems);
      this.items = res?.lineItems;
      this.subTotal = res?.lineItems.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
      // this.quantitiesCount = res.lineItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      // console.log(this.quantitiesCount);
      this.selectedItemsArray = Array(this.items?.length);
      //console.log(this.items$);
      this.items.forEach((e, index) => {
        if (e.service.processes != undefined && e.service.processes.multi) {
          this.selectedItemsArray[index] = e.files[0].processes;
        }
      });
    });
  }

  ngOnInit() {
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
  }

  ngAfterViewInit() {}

  delete(entity) {
    this.loadingService.register(this.key);

    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
      this.loadingService.resolve(this.key);
    });
  }

  checkout() {
    this.loadingService.register(this.key);

    this.service.checkout().subscribe(
      (resp) => {
        this.service.searchTerm = '';
        this.loadingService.resolve(this.key);
        // this.refresh();
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }
  convertToGallery() {
    this.loadingService.register(this.key);
    this.galleryService.convertToGallery().subscribe(
      (res) => {
        this.toastr.success('Successful Addition To Gallery');
        this.loadingService.resolve(this.key);
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }

  updateItem(item: ShoppingCartItem, quantity) {
    this.loadingService.register(this.key);
    let newItem = Object.assign({}, item);
    newItem.quantity = quantity;
    // console.log(newItem);
    // console.log(this.items$);
    if (quantity < 1 || quantity == '') {
      return;
    }
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        // this.service.searchTerm = '';
        this.loadingService.resolve(this.key);

        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
      }
    );

    // this.appStore.dispatch(new fromStore.UpdateLineItemQuantity(newItem));
  }

  textAreaChange(item: ShoppingCartItem, notes) {
    this.loadingService.register(this.key);
    let newItem = Object.assign({}, item);
    newItem.notes = notes;

    this.service.update(newItem).subscribe(
      (res) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
        this.loadingService.resolve(this.key);
      },
      (errr) => this.loadingService.resolve(this.key)
    );
  }
  // removeCart() {
  //   this.service.removeCart().subscribe();
  // }

  // checkItems() {
  //   if (this.items.length === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  getFileUrl(entity: ShoppingCartItem): string {
    // this.loadingService.register(this.key);
    // setTimeout(() => {
    //   this.loadingService.resolve(this.key);
    // }, 500);

    return this.appConfig.FILE_URL + entity.files[0].asset_id;
  }

  getFileExtension(entity: ShoppingCartItem) {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return 'image';
    } else if (extension[extension.length - 1].toLowerCase() == 'stl') {
      return 'stl';
    } else {
      return null;
    }
  }
  // public getSubTotal(): Observable<number> {
  //   // return this.items.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   let subTotal;
  //   this.entities$.subscribe((res) => {
  //     subTotal = res.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  //   });
  //   return subTotal;
  // }
  selectChange(item: LineItem, event, type: string) {
    this.loadingService.register(this.key);
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0][type] = event.target.value;
    this.service.update(newItem).subscribe(
      (res) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }

  inputNumberChanged(item: LineItem, event, type: string, element: HTMLElement) {
    //console.log(event.target.value);
    this.loadingService.register(this.key);
    if (event.target.value == '') {
      element.innerText = '*number is required';
    } else if (event.target.value < 1) {
      element.innerText = '*min value is 1';
    } else {
      element.innerText = '';
      let newItem = JSON.parse(JSON.stringify(item));
      newItem.files[0][type] = event.target.value;
      this.service
        .update(newItem)
        .pipe(
          debounceTime(500),
          switchMap(() => {
            return this.service.update(newItem);
          }),
          delay(500)
        )
        .subscribe(
          (res) => {
            this.appStore.dispatch(new fromStore.LoadInitState());
            this.loadingService.resolve(this.key);
          },
          (err) => {
            this.loadingService.resolve(this.key);
          }
        );
    }
  }

  onItemSelect(item: LineItem, i, element: HTMLElement) {
    this.loadingService.register(this.key);
    element.innerText = '';
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0]['processes'] = this.selectedItemsArray[i];
    console.log(newItem);
    this.service.update(newItem).subscribe(
      (res) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }
  onItemDeSelect(item: LineItem, i, element: HTMLElement) {
    this.loadingService.register(this.key);
    if (this.selectedItemsArray[i].length == 0) {
      element.innerText = '*processes is required';
    } else {
      element.innerText = '';
      let newItem = JSON.parse(JSON.stringify(item));
      newItem.files[0]['processes'] = this.selectedItemsArray[i];
      console.log(newItem);
      this.service.update(newItem).subscribe(
        (res) => {
          this.appStore.dispatch(new fromStore.LoadInitState());
          this.loadingService.resolve(this.key);
        },
        (err) => {
          this.loadingService.resolve(this.key);
        }
      );
    }
  }
  onSelectAll(item: LineItem, event, element: HTMLElement) {
    this.loadingService.register(this.key);
    element.innerText = '';
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0]['processes'] = event;
    console.log(newItem);
    this.service.update(newItem).subscribe(
      (res) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
        this.loadingService.resolve(this.key);
      },
      (res) => {
        this.loadingService.resolve(this.key);
      }
    );
  }
  onDeSelectAll(element: HTMLElement) {
    //console.log(this.selectedItemsArray[i]);
    element.innerText = '*processes is required';
  }
}