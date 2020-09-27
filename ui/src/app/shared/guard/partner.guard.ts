import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../domain';
import { UserService } from '../services/user.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard implements CanActivate {
  // private isAuthenticated = false;

  private isPartner = false;
  user = {} as User;
  constructor(private router: Router, private service: UserService, private appStore: Store<fromStore.AppState>) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => {
      console.log(user);
      if (user.defaultOrgType === 'PARTNER') {
        this.isPartner = true;
      }
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isPartner) {
      return true;
    } else {
      this.router.navigate(['']);
    }
    return false;
  }
}
