import { CartDetails } from '../../domain/cart-details.model';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private CartService: CartService, private router: Router) { }

  CartItem  = new CartDetails() ;
  allCartItem: CartDetails [];
  ngOnInit() {
this.CartService.getAllCartItem().subscribe(
  res => {this.allCartItem = res   ; console.log(this.allCartItem); }

);
  }
  deletItem(id) {
    this.CartService.deletCartItem(id).subscribe(res => {this.CartItem = res ; });
  }

  onsubmit() {
    this.CartService.addOrder(this.CartItem).subscribe(
      res => {console.log(res);
              this.router.navigateByUrl('/order'); });
  }

}
