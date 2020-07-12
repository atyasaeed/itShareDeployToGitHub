import { Component, OnInit, Inject } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { ShoppingCartItem, User } from 'src/app/shared/domain';
import { ShoppingCartService } from '../shopping-cart/shoppingcart.service';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { GalleryService } from './gallery.service';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from 'src/app/router.animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [routerTransition()],
})
export class GalleryComponent extends DefaultListComponent<ShoppingCartItem, GalleryService> implements OnInit {
  breadcrumbs = [{ heading: 'Gallery', icon: 'fa-tasks' }];
  lang: string;
  loading = false;
  subTotal = 0;
  authUser$: Observable<User>;
  hasAdminRole = false;
  private _searchTerm = '';
  constructor(
    service: GalleryService,
    private appStore: Store<fromStore.AppState>,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private toastr: ToastrService
  ) {
    super(service);
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
    this.entities$.subscribe((items) => {
      console.log(items);
      this.subTotal = items.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
    });
  }
  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `id:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }

  getFileUrl(entity: ShoppingCartItem): string {
    return this.appConfig.FILE_URL + entity.files[0].asset_id;
  }

  addLineItem(entity) {
    // console.log(entity);
    this.service.cloneItem(entity).subscribe((res) => {
      this.toastr.success('Successful Addition To Your Cart');
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  removeItem(id, index) {
    // this.entities$.subscribe((res) => {
    //   res = res.splice(
    //     res
    //       .map(function (x) {
    //         return x.id;
    //       })
    //       .indexOf(id),
    //     1
    //   );
    // });
    this.service.removeItem(id).subscribe((res) => {
      this.entities$.subscribe((res) => {
        res.splice(index, 1);
      });
      this.toastr.success('Removed Successfully');
    });
  }
  getFileExtension(entity: ShoppingCartItem) {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return this.appConfig.FILE_URL + entity.files[0].asset_id;
    } else {
      return false;
    }
  }
}
