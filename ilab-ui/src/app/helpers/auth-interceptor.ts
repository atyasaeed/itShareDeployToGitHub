import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,private router: Router) {}
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
    return next.handle(request).pipe(tap(() => {},(err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {

         return;
        }
        localStorage.removeItem('currentUser');
        this.router.navigate(['login']);
      }}));
  }
}
