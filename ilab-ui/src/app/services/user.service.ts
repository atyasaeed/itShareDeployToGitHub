import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain';
import { AuthenticationService } from './authentication.service';
import { APP_CONFIG, IAppConfig } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient , 
    private AuthenticationService: AuthenticationService, 
    @Inject(APP_CONFIG) private appConfig:IAppConfig) { }
 
  register(user: User) {
    return this.http.post(this.appConfig.REGISTER_URL, user);
  }
  getAll() {
    return this.http.get<User[]>(`/users`);
  }
  delete(id: number) {
    return this.http.delete(`/users/${id}`);
  }

  forgetPassword(email: any) {
    return this.http.post<any>('/users/forgetpassword', email);

  }
  changePassword(model: any) {
    const username = this.AuthenticationService.currentUserValue.username;
    return this.http.post<any>('/users/changePassword', { username, model});

  }
}
