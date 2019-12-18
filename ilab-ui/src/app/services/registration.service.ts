import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../components/log-in/log-in.component';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  public _url = 'https://jsonplaceholder.typicode.com/users';

  constructor(private _httpClient: HttpClient) { }

  AddUser() {
    return this._httpClient.post('_url', User);
  }
  GetUser() {
    return this._httpClient.get('_url');
  }
}

