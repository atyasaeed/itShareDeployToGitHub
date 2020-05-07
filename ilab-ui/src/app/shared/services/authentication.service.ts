import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IAppConfig, APP_CONFIG } from '../app.config';
import { User } from '../domain';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>,
    private router: Router
  ) {}

  login(loginInfo: any) {
    return this.http
      .post<any>(this.appConfig.LOGIN_URL, `username=${loginInfo.userName}&password=${loginInfo.password}`, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('responseType', 'text'),
      })
      .pipe(
        map((user) => {
          if (user && user.username) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.appStore.dispatch(new fromStore.UpdateAuthUser(user));
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out

    localStorage.removeItem('currentUser');
    // this.currentUserSubject.next(null);
    this.appStore.dispatch(new fromStore.UpdateAuthUser(null));
    this.router.navigate(['login']);
    //  to call backend logout
    return this.http
      .get<any>(this.appConfig.LOGOUT_URL)
      .pipe(
        tap(() => {
          console.log('Backend Logout is Done');
          // TODO: Subscribet to to ensure the promise is working.
        })
      )
      .subscribe((result) => {
        console.log('Logout');
      });
  }
}
