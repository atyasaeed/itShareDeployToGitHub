import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService, ShoppingCartService } from 'src/app/services';
import { Router, NavigationEnd } from '@angular/router';
import { ShoppingCartItem } from 'src/app/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public pushRightClass: string;
  loggedIn: boolean;
  items: Array<ShoppingCartItem>;
  loading = false;
  // tslint:disable-next-line: max-line-length
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private translate: TranslateService
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }



  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => {
      this.loggedIn = user ? true : false;
    });
    //this.shoppingCartService.refresh().subscribe(items => this.items = items);
    this.refresh();



  }



  // islogin() {
  //   return this.authenticationService.currentUserValue != null;
  // }

  logout() {
    this.shoppingCartService.removeCart().subscribe();
    return this.authenticationService.logout().subscribe(res => { this.router.navigateByUrl('/login'); });
  }


  private refresh() {
    // this.shoppingCartService.query<ShoppingCartItem[]>().subscribe(items => this.items = items);
    this.shoppingCartService.refresh().subscribe(items => this.items = items);
  }

  deletItem(id) {
    this.loading = true;
    this.shoppingCartService.delete(id).subscribe(resp => {
      this.refresh();
      this.loading = false;
    }, err => { this.loading = false; });
  }

  getImageUrl(index: number): string {
    return this.appConfig.ASSETS_URL + this.items[index].service.id;

  }

  // language
  changeLang(language: string) {
    this.translate.use(language);
  }
  ltr() {
    const dom: any = document.querySelector('body');
    dom.classList.add('rtl');
}
rtl(){
  const dom: any = document.querySelector('body');

  dom.classList.remove('rtl');
}

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }
  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }


}
