import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private _router : Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {
      if (localStorage.getItem('currentUser') != null) {
        return true;
      } else {
        console.log(state.url);
        console.log(encodeURI(state.url));
        console.log(decodeURI(state.url));
        // this._router.navigate(['/login'], { queryParams: { returnUrl: encodeURIComponent(state.url) }});

        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
  }

}
