import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor( private _httpclient: HttpClient , private _router: Router) { }

  getauth(username , password) {


   this._httpclient.post<Object>('http://localhost:8080/login',{username,password}, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded').set('responseType', 'text'),
        observe: 'response',
        withCredentials: true
    }).subscribe((resp: HttpResponse<Object>) => {
      console.log('Session:' + resp.headers.get('Set-Cookie'));
      // tslint:disable-next-line: max-line-length
      this._httpclient.get('http://localhost:8080/api/services', {withCredentials: true}).subscribe(resp => console.log('The services:' + resp));
 });

  }
}








