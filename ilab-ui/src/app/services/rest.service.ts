import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor( private _httpclient: HttpClient) { }

 register(model){
   return this._httpclient.post('http://localhost:8080/api/register', model)
 }

  login(username: string , password: string) {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    return this._httpclient.get('http://localhost:8080/api/services', {headers, responseType: 'text' as 'json'});
  }



}
