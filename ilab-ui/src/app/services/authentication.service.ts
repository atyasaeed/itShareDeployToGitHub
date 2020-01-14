import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from "rxjs/operators";
import { User } from '../domain';
import { ok } from 'assert';
import { IAppConfig, APP_CONFIG } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: IAppConfig) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string) {

    // return this.http.post<any>(`/users/authenticate`, { username, password })
    return this.http.post<any>(this.appConfig.LOGIN_URL, `username=${username}&password=${password}`,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded').set('responseType', 'text'),
        // observe: 'response',
      }

    )
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.name) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));


  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    //TODO: to call backend logout
    return this.http.get<any>(this.appConfig.LOGOUT_URL);

  }
}
