import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Observable } from 'rxjs';
import { User, ShoppingCartItem, LineItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { ShoppingCartService } from '../../../shared/services/shoppingcart.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { TdLoadingService } from '@covalent/core/loading';
import { AnimationService } from 'src/app/shared/services/animation.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DefaultListComponent<ShoppingCartItem, ShoppingCartService> implements OnInit {
  authUser$: Observable<User>;
  public pushRightClass: string;
  lang: string;
  items$: LineItem[];
  quantitiesCount;
  userLogin;
  scrWidth: number;
  @ViewChild('cartPosition') cartPosition: ElementRef;
  @ViewChild('cartPositionSmallScreen') cartPositionSmallScreen: ElementRef;
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
      this.scrWidth = window.innerWidth;
    }
  constructor(
    private translate: TranslateService,
    public authenticationService: AuthenticationService,
    service: ShoppingCartService,
    private appStore: Store<fromStore.AppState>,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private router: Router,
    loadingService: TdLoadingService,
    private cartAnimation:AnimationService
  ) {
    super(service, loadingService);
    this.appStore.dispatch(new fromStore.LoadInitState());

    this.appStore.select(fromStore.getShoppingCart).subscribe((res) => {
      this.items$ = res?.lineItems;

      //this.quantitiesCount = res?.lineItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      this.quantitiesCount = res?.lineItems.length;
      //console.log(this.quantitiesCount);
    });
    this.scrWidth = window.screen.width;
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    this.authUser$.subscribe((res) => {
      this.userLogin = res;
    });
    console.log(`${this.translate.getBrowserLang()},${this.translate.getDefaultLang()}`);
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      this.lang = res;
    });

  }

  ngAfterViewChecked() {
    this.appStore.select(fromStore.getAuthUser).subscribe(res => {
      if (this.scrWidth > 992) {
      this.cartAnimation.getCartPosition(this.cartPosition);
      } else {
        this.cartAnimation.getCartPosition(this.cartPositionSmallScreen);
      }
    })
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
  signupPartner() {
    this.router.navigate(['/signup'], { queryParams: { partner: 'true' } });
  }
}
