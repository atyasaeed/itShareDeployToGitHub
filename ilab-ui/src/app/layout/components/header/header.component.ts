import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/domain';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authUser$: Observable<User>;
  public pushRightClass: string;
  lang: string;
  constructor(
    private translate: TranslateService,
    public authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>,
    private router: Router
  ) {}

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
}
