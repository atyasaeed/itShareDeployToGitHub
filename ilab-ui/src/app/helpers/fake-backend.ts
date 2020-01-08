import { Service } from './../domain/service.model';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { User, Order } from '../domain';
import { ActivatedRoute } from '@angular/router';
import { LineItem } from '../domain';
// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
const orders:any[] = JSON.parse(localStorage.getItem('orders')) || [];

const lazerDetails = 'Computer-controlled cutting machine used for cutting various hard materials.' +
                     'Performs the tasks of many carpentry shop machines such as the panel saw, the spindle moulder, and the boring machine. ' +
                     'CNC equipment that uses laser to engrave and cut metal/non-metal materials.' +
                     'The machines equipped with high-dynamic step motor and high-accuracy linear guide way,leading to high dynamic response and load capacity. ';
const PrintingDetails = 'Print with over 15 different print materials or combine two different materials into one single print.' +
                        'Print anything in 3D with amazing details ' +
                        'Print quality ranging from 50 micron up to 250 micron.' +
                        'Provides users with an intuitive, easy-to-use manufacturing tool for every stage of their product development workflow' +
                        'Print Mechanical parts, Mockups for product design, Robotics parts, and Architecture designs ';

const scanningDetails = 'Offers an enhanced Handheld HD Scan Mode and enlarged scan range.' +
                        'Captures 3D model of medium to large size objects with high efficiency. ' +
                        'Meets demands for wider range of applications' +
                        'Measures the geometry of physical objects by sensing discrete points on the surface of the object with a probe' +
                        'Offers Point-to-point and optional scanning configurations with high resolution scales';
const services: Service[] = [
  { id: 1, title: 'Laser Cutting',
   description: 'Computer-controlled cutting machine used for cutting various hard materials.',
   image: '../../assets/img03.jpg',
   details: lazerDetails, imageDetails: '../../assets/lazer.png'},

  { id: 2, title: '3D Printing',
   description: 'Computer-controlled cutting machine used for cutting various hard materials.',
   image: '../../assets/img04.jpg',
   details: PrintingDetails,
   imageDetails: '../../assets/3DPrinting.png'
   },

  { id: 3, title: '3D scanning',
    description: 'Captures 3D model of medium to large size objects with high efficiency.' ,
    image: '../../assets/img05.jpg',
    details: scanningDetails ,
    imageDetails: '../../assets/3DScaning.png'
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(private route: ActivatedRoute) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body, } = request;
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
        case url.endsWith('/users/forgetpassword') && method === 'POST':
          return forgetPassword();
        case url.endsWith('/users/changePassword') && method === 'POST':
          return changePassword();
        case url.endsWith('/users/logout') && method === 'POST':
          return logout();
        case url.endsWith('/services') && method === 'GET':
          return getServices();
        case url.match(/\/services\/\d+$/) && method === 'GET':
          return servicebyid();
        case url.endsWith('/cart/items') && method === 'POST':
          return addCartItem();
        case url.endsWith('/cart/items') && method === 'GET':
          return getShoppingCartItems();
          case url.endsWith('/cart/items/') && method === 'PUT':
          return updateCartItems();
        case url.match(/\/cart\/items\/\d+$/) && method === 'DELETE':
          return deletCartItem();
        case url.endsWith('/orders') && method === 'POST':
          return addOrder();
        case url.endsWith('/orders') && method === 'GET':
          return getOrders();
        case url.match(/\/orders\/\d+$/) && method === 'PUT':
          return updateOrder();

          // retrieve all orders
        // case url.match(/\/getServiceDetailsById\/\d+$/) && method === 'GET':
        //   return getServiceDetailsById();
        // case url.endsWith('/editService') && method === 'POST':
        //   return editService();

        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
      // route functions

      function authenticate() {
        const { username, password } = body;
        const user = users.find(x => x.username === username && x.password === password);
        if (!user) { return error('Username or password is incorrect'); }
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token: 'fake-jwt-token'
        });
      }
      function register() {
        const user = body;

        if (users.find(x => x.username === user.username)) {
          return error('Username "' + user.username + '" is already taken');
        }

        user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return ok();
      }
      function getUsers() {
        if (!isLoggedIn()) { return unauthorized(); }
        return ok(users);
      }
      function deleteUser() {
        if (!isLoggedIn()) { return unauthorized(); }

        users = users.filter(x => x.id !== idFromUrl());
        localStorage.setItem('users', JSON.stringify(users));
        return ok();
      }
      // helper functions

      function ok(body?) {
        return of(new HttpResponse({ status: 200, body }));
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
      function logout() {
        return ok();
      }
      function changePassword() {

        const model = body;
        const user = users.find(r => r.username === model.username);
        if (isLoggedIn() && user.password === model.model.oldpassword) {
          user.password = model.model.newpassword;
          localStorage.setItem('users', JSON.stringify(users));
          return ok(user);
        }


      }

      function getServices() {
        return ok(services);
      }

      function servicebyid() {
        const service = services.find(x => x.id === idFromUrl());
        return ok(service);
      }

      function addCartItem() {
        const item = body;

        item.id = shoppingCart.length ? Math.max(...shoppingCart.map(x => x.id)) + 1 : 1;
        shoppingCart.push(item);
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        return ok();
      }
      function getShoppingCartItems() {
        return ok(shoppingCart);
      }

      function deletCartItem() {
        const  shoppingCartitem = shoppingCart.find(x => x.id !== idFromUrl());
        shoppingCart.splice('shoppingCartitem', 1);
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        return ok();
      }
      function getOrders() {
        return ok(orders);
      }
      function updateCartItems() {
       const item = body;
       const cartitem = shoppingCart.find(x => x.id === item.id);
       cartitem.quantity = item.quantity;
       localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
       return ok(cartitem);
      }

      function addOrder() {
        const order:Order=body;

        order.id = orders.length ? Math.max(...orders.map(x => x.id)) + 1 : 1;
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // return ok(localStorage.getItem('ordersDetalis'));
        localStorage.removeItem('shoppingCart');
        shoppingCart = {};
        return ok();
      }

      function updateOrder() {
        const order:Order=body;
        const orderitem = orders.find(rr=>rr.id == order.id);
        orderitem.status = order.status;
        // console.log(order);
        // order.status = 'Canceled';
        localStorage.setItem('orders', JSON.stringify(orders));
        return ok(orderitem);
      }

      // function getServiceDetailsById() {
      //   const serviceDetails = cartDetails.find(x => x.id === idFromUrl());
      //   return ok(serviceDetails);

      // }
      // function editService() {
      //   const model = body;
      //   const serviceDetails = cartDetails.find(r => r.id === model.id);
      //   localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
      //   return ok(serviceDetails);


      // }
    }
  }




}
export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
