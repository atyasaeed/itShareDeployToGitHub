import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.authenticationService.currentUserValue;
    request = request.clone({
      withCredentials: true,
    });
    // if (currentUser && currentUser.username) {
    //     request = request.clone({
    //         withCredentials: true,
    //         setHeaders: {
    //             // Authorization: `Bearer ${currentUser.token}`

    //         }
    //     });
    // }
    return next.handle(request);
  }
}
