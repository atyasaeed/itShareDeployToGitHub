import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartItem } from 'src/app/domain/shoppingcart-item.model';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { Order, LineItem } from 'src/app/domain';
import { OrderItem } from 'src/app/domain/order-item.model';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loading = false;
  items: Array<ShoppingCartItem>;
  constructor(private shoppingCartService: ShoppingCartService,
              private ordersService: OrdersService,
              private router: Router,
              @Inject(APP_CONFIG) private appConfig: IAppConfig) { }

  ngOnInit() {
   // this.shoppingCartService.refresh().subscribe(items=>this.items =items);
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
    // const order=new Order();
    // // order.status="Waiting For Approval";
    // order.date=new Date();
    // order.lineItems=this.items.map((scItem:ShoppingCartItem)=>{
    //   this.refresh();
    //   const orderItem=new OrderItem();
    //   orderItem.color= scItem.color;
    //   orderItem.plannedStartDate = scItem.plannedStartDate;
    //   orderItem.file = scItem.file;
    //   orderItem.material = scItem.material;
    //   orderItem.unitPrice = scItem.unitPrice;
    //   orderItem.quantity=scItem.quantity;
    //   orderItem.status="WQ";
    //   orderItem.unit= scItem.unit;
    //   orderItem.service=scItem.service;
    //   orderItem.id=scItem.id;
    //   this.router.navigateByUrl('/orders');
    //    return orderItem;
    // });

    // this.ordersService.create(order).subscribe(resp=>{
    //   this.refresh();
    // });
    this.shoppingCartService.checkout().subscribe(resp => {
      this.refresh();
    });


    // this.CartService.addOrder(this.item).subscribe(
    //   res => {
    //     console.log(res);
    //     this.router.navigateByUrl('/order');
    //   });
  }
  private refresh() {
    // this.shoppingCartService.query<ShoppingCartItem[]>().subscribe(items => this.items = items.sort((obj1, obj2) => {
    //   if (obj1.rank > obj2.rank) { return 1; } else { return -1; }
    // }));
    this.shoppingCartService.refresh().subscribe(items => this.items = items);
  }
  updateItem(item: ShoppingCartItem) {
    this.loading = true;
    this.shoppingCartService.update<ShoppingCartItem>(item.id, item).subscribe(
  res => {
    // this.refresh();
     this.loading = false;
    }, err => {this.loading = false; });

  }
  getImageUrl(index: number): string {
    return this.appConfig.ASSETS_URL + this.items[index].service.id;
  }

  checkItems() {
    if (this.items.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getFileUrl(index):string{
    return this.appConfig.FILE_URL+this.items[index].asset_id;
  }
}
