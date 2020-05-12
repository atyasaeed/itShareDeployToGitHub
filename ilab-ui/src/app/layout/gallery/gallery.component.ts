import { Component, OnInit, Inject } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { ShoppingCartItem } from 'src/app/shared/domain';
import { ShoppingCartService } from '../shopping-cart/shoppingcart.service';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService> implements OnInit {
  lang: string;
  loading = false;
  subTotal = 0;
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

  ngOnInit() {
    super.ngOnInit();
    this.entities$.subscribe((items) => {
      this.subTotal = items.map((item) => item.unitPrice * item.quantity).reduce((a, b) => a + b, 0);
    });
  }
  getImageUrl(entity: ShoppingCartItem): string {
    return this.appConfig.ASSETS_URL + entity.service.id;
  }
  getFileUrl(entity: ShoppingCartItem, fileIndex): string {
    return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
  }

  addLineItem(entity) {
    console.log(entity);
    console.log(entity.files);
    const formData: FormData = new FormData();
    this.service.create(entity).subscribe((res) => console.log(res));
  }
}
