import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private authenticationservice: AuthenticationService) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticationservice.CurrentUserValue != null) {
      return true;
    } else {
      // console.log(state.url);
      // console.log(encodeURI(state.url));
      // console.log(decodeURI(state.url));
      // this._router.navigate(['/login'], { queryParams: { returnUrl: encodeURIComponent(state.url) }});

      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
