import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../domain';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard implements CanActivate {
  private isAuthenticated = false;

  private isPartner = false;
  user = {} as User;
  constructor(private router: Router, private service: UserService) {
    this.service.getAuthUserDetails().subscribe((res) => {
      // this.isAuthenticated = res !== null;
      // this.isPartner = res && res.defaultOrg.type === 'PARTNER';
      // console.log(this.isPartner);
      console.log(res);
      if (res.defaultOrg.type === 'PARTNER') {
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
