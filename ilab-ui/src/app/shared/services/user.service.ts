import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../domain';
import { APP_CONFIG, IAppConfig } from '../app.config';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends RestService<User> {
  resource = 'user';
  private userProfileSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public userProfile: Observable<User> = this.userProfileSubject.asObservable();

  // constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: IAppConfig) {}

  register(user: any) {
    return this.http.post(this.appConfig.REGISTER_URL, user);
  }

  getAll() {
    return this.http.get<User[]>(`/user`);
  }
  // delete(id: number) {
  //   return this.http.delete(`/user/${id}`);
  // }

  forgetPassword(email: any) {
    return this.http.post<any>(this.appConfig.RESET_PASSWORD_URL, email);
  }
  changePassword(model: any) {
    return this.http.post<any>(this.appConfig.CHANGE_PASSWORD_URL, model);
  }
  restPassword(password: any) {
    return this.http.post<any>(this.appConfig.SAVE_PASSWORD_URL, password);
  }

  getUser() {
    this.http.get<User>(this.appConfig.REGISTER_URL).subscribe((data) => this.userProfileSubject.next(data));
    return this.userProfile;
  }

  updateUser(user: User) {
    this.http.put<User>(this.appConfig.REGISTER_URL, user).subscribe((data) => this.userProfileSubject.next(data));
    return this.userProfile;
    // return this.http.put(this.appConfig.REGISTER_URL, user).
  }
  adminUpdateUser(body: any) {
    // return this.http.put<User>(this.url + '/admin', body);

    return this.http.put<User>(this.appConfig.getResourceUrl(this.resource + '/admin'), body);
  }
  getUserProfile() {
    return this.http.get(this.appConfig.getResourceUrl(this.resource));
  }

  getAuthUserDetails() {
    return this.http.get<User>(this.appConfig.getResourceUrl('user'));
  }

  activate(formdata: FormData) {
    return this.http.put(this.appConfig.REGISTER_URL + '/activate', formdata);
  }
  resendCode(username) {
    console.log(this.appConfig.API_END_POINT + `api/users/resendProvision?username=${username}`);
    return this.http.get<User>(this.appConfig.API_END_POINT + `api/users/resendProvision?username=${username}`);
  }

  userState(id) {
    this.resource = this.resource + `/${id}/enable`;
    this.update('').subscribe((res) => {
      this.resource = 'user';
    });
  }
}
