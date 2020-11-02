import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../domain';
import { getAuthUser, getInitStateLoaded } from 'src/app/store';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class userPrivilege implements CanActivate {
  private hasPrivilege = false;
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
            if (user && (user.roles.includes('ROLE_REGISTER_PRIVILEGE') || user.roles.length == 0)) {
              this.hasPrivilege = true;
            } else {
              this.router.navigate(['']);
            }
            observer.next(this.hasPrivilege);
            observer.complete();
          }).unsubscribe();
        });
    });
  }
}
