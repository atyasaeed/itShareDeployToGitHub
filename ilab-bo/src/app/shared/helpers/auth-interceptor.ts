import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.CurrentUserValue;
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
