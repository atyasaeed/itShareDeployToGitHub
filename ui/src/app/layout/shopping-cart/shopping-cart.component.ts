import { ToastrService } from 'ngx-toastr';
import { User } from '../../shared/domain/user.model';
import { Component, OnInit, Inject, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ShoppingCartItem, Order, LineItem } from 'src/app/shared/domain';
import { ShoppingCartService } from '../../shared/services/shoppingcart.service';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddressBookService } from 'src/app/shared/services/address-book.service';
import { Address } from 'src/app/shared/domain/address.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  selectedItemsArray;
  modalRef: BsModalRef;
  myAddressess: Address[];
  myShippingAddress: number | string;
  @ViewChild('checkOutModal') checkOutModal: ElementRef;
  constructor(
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService,
    private galleryService: GalleryService,
    private modalService: BsModalService,
    private addressBookService: AddressBookService,
    private router: Router,
    private translateService: TranslateService
  ) {
    super(service, loadingService);
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });

    this.dropdownSettings = {
      singleSelection: false,
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      this.items = res?.lineItems;
      this.subTotal = res?.lineItems.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
      this.selectedItemsArray = Array(this.items?.length);
      this.items?.forEach((e, index) => {
        if (e.service.processes != undefined && e.service.processes.multi) {
          this.selectedItemsArray[index] = e.files[0].processes;
        }
      });
    });
    this.addressBookService.searchTerm = '';
    this.addressBookService.model$.subscribe((res) => {
      this.myAddressess = res;
      this.myShippingAddress = this.myAddressess[0]?.id;
    });
  }

  ngOnInit() {
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
  }

  ngAfterViewInit() {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.modalRef = this.modalService.show(this.checkOutModal);
    }
  }

  delete(entity) {
    this.loadingService.register(this.key);
    this.purge(entity).subscribe(
      (result) => {
        this.appStore.dispatch(new fromStore.LoadInitState());
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }

  checkout() {
    this.loadingService.register(this.key);
    this.service.checkout(this.myShippingAddress).subscribe(
      (resp) => {
        this.service.searchTerm = '';
        this.loadingService.resolve(this.key);
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
    let newItem = Object.assign({}, item);
    newItem.quantity = quantity;
    if (quantity < 1 || quantity == '') {
      return;
    }
    this.loadingService.register(this.key);
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
      }
    );
  }

  decreaseQuantity(item: ShoppingCartItem, quantity) {
    let newItem = Object.assign({}, item);
    newItem.quantity = parseInt(quantity) - 1;
    if (quantity < 1 || quantity == '') {
      return;
    }
    this.loadingService.register(this.key);
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
      }
    );
  }

  increaseQuantity(item: ShoppingCartItem, quantity) {
    let newItem = Object.assign({}, item);
    newItem.quantity = parseInt(quantity) + 1;
    if (newItem.quantity < 1 || quantity == '') {
      return;
    }
    this.loadingService.register(this.key);
    this.loading = true;
    this.service.update(newItem).subscribe(
      (res) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
        this.appStore.dispatch(new fromStore.LoadInitState());
      },
      (err) => {
        this.loading = false;
        this.loadingService.resolve(this.key);
      }
    );
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  confirmOrderModal(template) {
    if (this.myAddressess.length > 0) {
      this.modalRef = this.modalService.show(template);
    } else {
      this.toastr.warning(this.translateService.instant('prompt.addAddress'));
      this.router.navigate(['/address-book/create'], { state: { fromRoute: '/shopping-cart' } });
    }

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
      (err) => this.loadingService.resolve(this.key)
    );
  }

  getFileUrl(entity: ShoppingCartItem): string {
    return this.appConfig.FILE_URL + entity.files[0].asset_id;
  }

  getFileExtension(entity: ShoppingCartItem) {
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
    if (event.target.value == '') {
      element.innerText = '*number is required';
    } else if (event.target.value < 1) {
      element.innerText = '*min value is 1';
    } else {
      this.loadingService.register(this.key);
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
    if (this.selectedItemsArray[i].length == 0) {
      element.innerText = '*processes is required';
    } else {
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
  }
  onSelectAll(item: LineItem, event, element: HTMLElement) {
    this.loadingService.register(this.key);
    element.innerText = '';
    let newItem = JSON.parse(JSON.stringify(item));
    newItem.files[0]['processes'] = event;
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
    element.innerText = '*processes is required';
  }

  changeShippingAddress(event) {
    this.myShippingAddress = event.target.value;
  }
}
