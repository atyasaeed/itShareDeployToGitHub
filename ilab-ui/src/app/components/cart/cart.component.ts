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

  constructor(private shoppingCartService: ShoppingCartService, private ordersService: OrdersService, private router: Router) { }
  loading = false;
  items: Array<ShoppingCartItem>;
  ngOnInit() {
    this.refresh();

  }
  deletItem(id) {
    this.loading = true;
    this.shoppingCartService.delete<ShoppingCartItem>(id).subscribe(resp => {
      this.refresh();
      this.loading = false;
    }, err => {this.loading = false; });
  }

  checkout() {
    const order=new Order();
    order.status="Waiting For Quotation";
    // order.status="Waiting For Approval";
    order.date=new Date();
    order.lineItems=this.items.map((scItem:ShoppingCartItem)=>{
      this.refresh();
      const orderItem=new OrderItem();
      orderItem.color= scItem.color;
      orderItem.deliveryDate = scItem.deliveryDate;
      orderItem.file = scItem.file;
      orderItem.material = scItem.material;
      orderItem.price = scItem.price;
      orderItem.quantity=scItem.quantity;
      orderItem.status="WQ";
      orderItem.unit= scItem.unit;
      orderItem.service=scItem.service;
      orderItem.id=scItem.id;
      this.router.navigateByUrl('/orders');
       return orderItem;
    });

    this.ordersService.create(order).subscribe(resp=>{
      this.refresh();
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
