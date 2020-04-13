import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { User } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class ProfileService extends RestService<User> {
  resource = 'users';
}
