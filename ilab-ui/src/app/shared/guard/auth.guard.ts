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
export class AuthGuard implements CanActivate {
  authUser: User;
  constructor(private router: Router, private appStore: Store<fromStore.AppState>) {
    this.appStore.select(fromStore.getAuthUser).subscribe((user) => (this.authUser = user));
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authUser) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
