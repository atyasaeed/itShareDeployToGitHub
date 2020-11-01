import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getAuthUser, getInitStateLoaded } from 'src/app/store';
import { filter, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private isAuthenticated: boolean = false;
  private hasAdminRole: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private appStore: Store<fromStore.AppState>
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((observer) => {
      this.appStore
        .select(getInitStateLoaded)
        .pipe(filter((res) => res === true))
        .subscribe((res) => {
          this.appStore.select(getAuthUser).subscribe((user) => {
            if (user) {
              this.isAuthenticated = true;
            }
            this.hasAdminRole = user && user.roles.includes('ROLE_ADMIN');
            if (this.isAuthenticated && !this.hasAdminRole) {
              this.router.navigate(['/access-denied']);
            } else if (!this.isAuthenticated) {
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
            observer.next(this.hasAdminRole);
            observer.complete();
          });
        });
    });
  }
}
