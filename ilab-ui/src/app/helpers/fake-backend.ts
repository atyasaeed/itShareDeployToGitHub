import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Service } from '../domain';
import { Order } from '../domain';
import { LineItem } from '../domain';
// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let services: Service[] = [{ id: 1, name: '3D Printing', img: 'assets/img06.jpg', description: 'Test test Test1' }, { id: 2, name: '3D Printing', img: 'assets/img09.jpg', description: 'Test test Test2' }, { id: 3, name: '3D Printing3', img: 'assets/img08.jpg', description: 'Test test Test3' }];

let orders: Order[] = [
  {
    id: 4566, date: new Date(), total_payment: 200, status: 'Waiting For Quotation', lineItems: [{
      id: 1, serviceName: '3D Printing', img: 'assets/img09.jpg', status: 'pending', details: 'ay Kalam'
    },
    { id: 2, serviceName: 'laser cutting machine', img: 'assets/img03.jpg', status: 'Done', details: 'ay Kalam version 02' },]
  },
  // {id: 5678, date: new Date(2020, 6, 31), total_payment: 540, status: 'Done' },
  {
    id: 5555, date: new Date(), total_payment: 930, status: 'Waiting For Approval', lineItems: [{
      id: 1, serviceName: '3D Printing', img: 'assets/img09.jpg', status: 'pending', details: 'ay Kalam'
    },
    { id: 2, serviceName: 'laser cutting machine', img: 'assets/img05.jpg', status: 'Done', details: 'ay Kalam version 02' },]
  },
  {
    id: 9999, date: new Date(), total_payment: 930, status: 'Canceled', lineItems: [{
      id: 1, serviceName: '3D Printing', img: 'assets/img09.jpg', status: 'pending', details: 'ay Kalam'
    },
    { id: 2, serviceName: 'laser cutting machine', img: 'assets/img05.jpg', status: 'Done', details: 'ay Kalam version 02' },]
  },
  {
    id: 9999, date: new Date(), total_payment: 930, status: 'Delivered', lineItems: [{
      id: 1, serviceName: '3D Printing', img: 'assets/img09.jpg', status: 'pending', details: 'ay Kalam'
    },
    { id: 2, serviceName: 'laser cutting machine', img: 'assets/img05.jpg', status: 'Done', details: 'ay Kalam version 02' },]
  },
];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return of(null).pipe(mergeMap(handleRoute))
      .pipe(materialize()).pipe(delay(500)).pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith("/users/forgetpassword") && method === 'POST':
          return forgetPassword();
        case url.endsWith("/users/changePassword") && method === 'POST':
          return changePassword();

        case url.endsWith('/services') && method === 'GET':
          return getServices();
        case url.endsWith('/orders') && method === 'GET':
          return getOrders();

        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
      // route functions

      function authenticate() {
        const { username, password } = body;
        const user = users.find(x => x.username === username && x.password === password);
        if (!user) return error('Username or password is incorrect');
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token: 'fake-jwt-token'
        })
      }
      function register() {
        const user = body

        if (users.find(x => x.username === user.username)) {
          return error('Username "' + user.username + '" is already taken')
        }

        user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return ok();
      }
      function getUsers() {
        if (!isLoggedIn()) return unauthorized();
        return ok(users);
      }
      function deleteUser() {
        if (!isLoggedIn()) return unauthorized();

        users = users.filter(x => x.id !== idFromUrl());
        localStorage.setItem('users', JSON.stringify(users));
        return ok();
      }
      // helper functions

      function ok(body?) {
        return of(new HttpResponse({ status: 200, body }))
      }

      function error(message) {
        return throwError({ error: { message } });
      }

      function unauthorized() {
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
      }

      function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
        // return true;
      }

      function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
      }

      function forgetPassword() {
        const email = body;
        const user = users.find(rr => rr.email === email);
        if (user) {
          return ok(user);
        }

      }
      function changePassword() {
        const user = body;
        if (users.find(rr => rr.password === user.oldpassword)) {
        }
        return ok()
      }

      function getServices() {
        return ok(services);
      }

      function getOrders() {
        return ok(orders);
      }

    }
  }




}
export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
