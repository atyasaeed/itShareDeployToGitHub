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
  private isPartner = false;
  user: User;
  constructor(private router: Router, private service: UserService, private appStore: Store<fromStore.AppState>) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => {
      if (user?.defaultOrgType === 'PARTNER') {
        this.isPartner = true;
        this.user = user;
      }
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isPartner) {
      if (this.user?.defaultOrgStatus === 'PENDING') {
        this.router.navigate(['/home/partner']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['']);
    }
    return false;
  }
}
