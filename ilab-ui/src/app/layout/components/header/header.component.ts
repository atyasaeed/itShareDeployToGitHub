import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Observable } from 'rxjs';
import { User, ShoppingCartItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { ShoppingCartService } from '../../shopping-cart/shoppingcart.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService> implements OnInit {
  authUser$: Observable<User>;
  public pushRightClass: string;
  lang: string;
  items$;
  quantitiesCount;

  constructor(
    private translate: TranslateService,
    public authenticationService: AuthenticationService,
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private router: Router
  ) {
    super(service);
    this.appStore.dispatch(new fromStore.LoadInitState());

    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      // console.log(res.lineItems);
      // this.items$ = Object.assign(res.lineItems);
      this.items$ = res?.lineItems;

      this.quantitiesCount = res?.lineItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      // console.log(this.quantitiesCount);
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    console.log(`${this.translate.getBrowserLang()},${this.translate.getDefaultLang()}`);
  }
  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  changeLang(language: string) {
    this.appStore.dispatch(new fromStore.UpdateLang(language));
  }

  // Shopping Cart Icon
  delete(entity) {
    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  checkout() {
    this.service.checkout().subscribe((resp) => {
      // this.service.searchTerm = '';
      // this.refresh();
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }

  getImageUrl(entity: ShoppingCartItem): string {
    return this.appConfig.ASSETS_URL + entity.service.id;
  }
  // Shopping Cart Icon
}
