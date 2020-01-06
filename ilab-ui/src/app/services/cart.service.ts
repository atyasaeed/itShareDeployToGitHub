import { Service } from './../domain/service.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartDetails } from '../domain/cart-details.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }


  getAllService() {
    return this.http.get<Service[]>(`/services`);
  }
  getServiceById(id){
    return this.http.get<Service>(`/servicebyid/${id}`)
  }
  addCartItem(CartItemDetails){
    return this.http.post('/add/cartItem', CartItemDetails);
  }
  getAllCartItem(){
    return this.http.get<CartDetails[]>('/getAll/CartItem');
  }
  deletCartItem(id){
    return this.http.delete<CartDetails>(`/deletCartItem/${id}`)
  }

  addOrder(orderDetalis){
   return this.http.post('/add/order', orderDetalis);
  }
  getServiceDetailsById(id){
    return this.http.get<any>(`/getServiceDetailsById/${id}`)
  }
  editService(model: any) {
    return this.http.post<any>('/editService/',model);

  }
}
