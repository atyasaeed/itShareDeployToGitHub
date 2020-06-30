import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/services';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/domain';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  collapsed: boolean;
  showMenu: string;
  authUser$: Observable<User>;
  hasAdminRole = false;
  lang: string;

  @Output() collapsedEvent = new EventEmitter<boolean>();
  constructor(
    private translate: TranslateService,
    public authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>
  ) {
    this.authUser$ = this.appStore.select(fromStore.getAuthUser);
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.authUser$.subscribe((user) => {
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
  }
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }
  changeLang(language: string) {
    this.appStore.dispatch(new fromStore.UpdateLang(language));
  }
}
