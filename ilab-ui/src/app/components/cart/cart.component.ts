import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartItem } from 'src/app/domain/shoppingcart-item.model';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Order, LineItem } from 'src/app/domain';
import { OrderItem } from 'src/app/domain/order-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private shoppingCartService: ShoppingCartService, private ordersService:OrdersService, private router: Router) { }

  items: Array<ShoppingCartItem>;
  ngOnInit() {
    this.refresh();

  }
  deletItem(id) {
    this.shoppingCartService.delete(id).subscribe(resp=>{

      this.refresh();
    });
  }

  checkout() {
    const order=new Order();
    order.status="Waiting For Quotation";
    // order.status="Waiting For Approval";
    order.date=new Date();
    order.lineItems=this.items.map((scItem:ShoppingCartItem)=>{
      const orderItem=new OrderItem();
      orderItem.quantity=scItem.quantity;
      orderItem.status="WQ";
      orderItem.service=scItem.service;
      orderItem.id=scItem.id;
      return orderItem;
    });

    this.ordersService.create(order).subscribe(resp=>{
      this.router.navigate(["/"]);
    });


    // this.CartService.addOrder(this.item).subscribe(
    //   res => {
    //     console.log(res);
    //     this.router.navigateByUrl('/order');
    //   });
  }
  private refresh(){
    this.shoppingCartService.query<ShoppingCartItem[]>().subscribe(items=>this.items=items);
  }
  updateItem(item:ShoppingCartItem){
    item.quantity=10;
    // this.shoppingCartService.update
    this.refresh;
  }
}
