import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  username: any;
  public pushRightClass: string;
  constructor(
    private translate: TranslateService,
    public router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.username = Object.values(this.authenticationService.CurrentUserValue).toString();
    console.log(this.username);
  }
  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  // rltAndLtr() {
  //   const dom: any = document.querySelector('body');
  //   dom.classList.toggle('rtl');
  // }
  ltr() {
    const dom: any = document.querySelector('body');
    dom.classList.add('rtl');
  }
  rtl() {
    const dom: any = document.querySelector('body');
    dom.classList.remove('rtl');
  }

  onLoggedout() {
    this.authenticationService.logout();
    // localStorage.removeItem('isLoggedin');
  }

  changeLang(language: string) {
    this.translate.use(language);
  }
}
