import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../domain';
import { Observable } from 'rxjs';
import { getAuthUser, getInitStateLoaded } from 'src/app/store';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard implements CanActivate {
  private noAuth: boolean = false;
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
            if (!user) {
              this.noAuth = true;
            } else {
              this.router.navigateByUrl('/');
            }
            observer.next(this.noAuth);
            observer.complete();
          });
        });
    });
  }
}
