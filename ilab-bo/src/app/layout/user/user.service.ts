import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { User } from 'src/app/shared/domain/user.model';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  users: User[]


  constructor(
    private http: HttpClient,
    private AuthenticationService: AuthenticationService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) { }

  register(user: User) {
    return this.http.post(this.appConfig.REGISTER_URL, user);
  }
  getAll() {
    this.users = [
      {
        firstName: 'abdelrahman',
        lastName: 'mohamed',
        phone: 12345678,
        username: 'body',
        id: '1',
        email: 'body@gmail',
        password: '123456',
        confirmPassword: '123456',
      },
      {
        firstName: 'islam',
        lastName: 'Almorshedy',
        phone: 12345678,
        username: 'Islam',
        id: '2',
        email: 'Islam@gmail',
        password: '123456',
        confirmPassword: '123456',
      },
    ];
    return this.users;
    // return this.http.get<User[]>(`/users`);
  }
  delete(id: string) {
    return this.http.delete(`/users/${id}`);
  }

  forgetPassword(email: any) {
    return this.http.post<any>('/users/forgetpassword', email);
  }
  changePassword(model: any) {
    const username = this.AuthenticationService.CurrentUserValue.username;
    return this.http.post<any>('/users/changePassword', { username, model });
  }
}
