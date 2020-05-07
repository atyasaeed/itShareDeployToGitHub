import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { User } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class UserService extends RestService<User> {
  resource = 'admin/users';

  userState(id) {
    this.resource = `admin/users/${id}/enable`;
    this.update('').subscribe((res) => {
      this.resource = 'admin/users';
    });
  }
}
