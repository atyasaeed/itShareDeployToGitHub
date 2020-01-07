import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartItem } from 'src/app/domain/shoppingcart-item.model';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private shoppingCartService: ShoppingCartService, private ordersService: OrdersService, private router: Router) { }
  loading = false;
  items: Array<ShoppingCartItem>;
  ngOnInit() {
    this.refresh();

  }
  deletItem(id) {
    this.loading = true;
    this.shoppingCartService.delete(id).subscribe(resp => {
      this.refresh();
    }, err => {this.loading = false; });
  }

  checkout() {
    this.ordersService.create(null).subscribe(resp => {
      if (localStorage.getItem('currentUser') !== null) {
        localStorage.removeItem('shoppingCart');
        this.router.navigate(['/']);
      }else{
        this.router.navigate(['/login'])
      }

    });


    // this.CartService.addOrder(this.item).subscribe(
    //   res => {
    //     console.log(res);
    //     this.router.navigateByUrl('/order');
    //   });
  }
  private refresh() {
    this.shoppingCartService.query<ShoppingCartItem[]>().subscribe(items => this.items = items);
  }
  updateItem(item: ShoppingCartItem) {
    this.loading = true;
    this.shoppingCartService.update<ShoppingCartItem>('', item).subscribe(
  res => {
     this.refresh();
     this.loading = false;
    }, err => {this.loading = false; });

  }
}
