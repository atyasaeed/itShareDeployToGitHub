import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../domain';
@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard implements CanActivate {
  authUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>
  ) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => (this.authUser = user));
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authUser != null) {
      this.router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }
}
