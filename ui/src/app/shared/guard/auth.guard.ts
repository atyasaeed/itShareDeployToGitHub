import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../domain';
import { getAuthUser, getInitStateLoaded } from 'src/app/store';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authUser: boolean = false;
  constructor(private router: Router, private appStore: Store<fromStore.AppState>) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((observer) => {
      this.appStore
        .select(getInitStateLoaded)
        .pipe(filter((res) => res === true))
        .subscribe((res) => {
          this.appStore
            .select(getAuthUser)
            .subscribe((user) => {
              if (user) {
                this.authUser = true;
              } else {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
              }
              observer.next(this.authUser);
              observer.complete();
            })
            .unsubscribe();
        });
    });
  }
}
