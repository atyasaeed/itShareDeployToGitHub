import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../domain';
import { UserService } from '../services/user.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getAuthUser, getInitStateLoaded } from 'src/app/store';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard implements CanActivate {
  private isActivePartner = false;

  constructor(private router: Router, private service: UserService, private appStore: Store<fromStore.AppState>) {}
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
              if (user?.defaultOrgType === 'PARTNER') {
                if (user?.defaultOrgStatus === 'PENDING') {
                  this.router.navigate(['/home/partner']);
                } else {
                  this.isActivePartner = true;
                }
              } else {
                this.router.navigate(['']);
              }
              observer.next(this.isActivePartner);
              observer.complete();
            })
            .unsubscribe();
        });
    });
  }
}
