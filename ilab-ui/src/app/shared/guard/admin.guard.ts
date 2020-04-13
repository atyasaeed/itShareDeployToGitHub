import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private isAuthenticated = false;
  private hasAdminRole = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>
  ) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => {
      this.isAuthenticated = user !== null;
      this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.hasAdminRole) {
      return true;
    }
    if (this.isAuthenticated) {
      this.router.navigate(['/access-denied']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }

    return false;
  }
}
