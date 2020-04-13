import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/domain';
import { APP_CONFIG, IAppConfig } from '../shared/app.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userProfileSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public userProfile: Observable<User> = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: IAppConfig) {}

  register(formdata: FormData) {
    return this.http.post(this.appConfig.REGISTER_URL, formdata);
  }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }
  delete(id: number) {
    return this.http.delete(`/users/${id}`);
  }

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

  updateUser(user: any) {
    this.http.put<User>(this.appConfig.REGISTER_URL, user).subscribe((data) => this.userProfileSubject.next(data));
    return this.userProfile;
    // return this.http.put(this.appConfig.REGISTER_URL, user).
  }
}
