import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor( private _httpclient: HttpClient , private _router: Router) { }
  cards :any [];

  getauth(username , password) {


return   this._httpclient.post<Object>('http://localhost:8080/login',`username=${username}&password=${password}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded').set('responseType', 'text'),
        observe: 'response',
        withCredentials: true
//     }).subscribe((resp: HttpResponse<Object>) => {
//       console.log('Session:' + resp.headers.get('Set-Cookie'))
//       localStorage.setItem('token','body');
//       // tslint:disable-next-line: max-line-length
//  });
}

   )}

   logout(){
     return this._httpclient.get('http://localhost:8080/logout',{withCredentials: true})
   }


  getservices() {

    return this._httpclient.get('http://localhost:8080/api/services', {withCredentials: true});

  }

  addservices(model) {
    return this._httpclient.post('http://localhost:8080/api/services', model ,{withCredentials: true})

  }

}








