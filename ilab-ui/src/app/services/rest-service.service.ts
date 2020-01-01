import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {
  modelLogin={
    userName:" mody",
    password:"123456",
    isLoggedin: false,
  }
  constructor() { }

  login(userName:string,password:string):boolean{
if (userName == this.modelLogin.userName && password == this.modelLogin.password) {
  return true
}
  }
}
