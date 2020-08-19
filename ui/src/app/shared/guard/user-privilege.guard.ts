import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../domain';
@Injectable({
  providedIn: 'root',
})
export class userPrivilege implements CanActivate {
  private isAuthenticated = false;
  private hasPrivilege = false;
  user = {} as User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>
  ) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => {
      this.isAuthenticated = user !== null;
      this.hasPrivilege = user && (user.roles.includes('ROLE_REGISTER_PRIVILEGE') || user.roles.length == 0);
      this.user = user;
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.hasPrivilege) {
      return true;
    }
    // if (!this.user) {
    //   return true;
    // }
    else {
      this.router.navigate(['']);
    }

    return false;
  }
}
