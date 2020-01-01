import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  register(user: User) {
    return this.http.post("/users/register", user);
  }
  getAll() {
    return this.http.get<User[]>(`/users`);
  }
  delete(id: number) {
    return this.http.delete(`/users/${id}`);
  }
}
