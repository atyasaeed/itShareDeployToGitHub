import { Component, Inject, Input, OnInit } from '@angular/core';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { Order } from 'src/app/shared/domain';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  @Input() order: Order;

  max: any
  dateArray: any[] = [];
  constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig, private orderService: OrderService) { }
  status: string;
  orders: Array<Order>;


  ngOnInit() {
    // this.orderService.query<Order[]>().subscribe(orders => (this.orders = orders));
    // this.getDeliveryDate();
  }

  // getDeliveryDate() {
  //   for (let index = 0; index < this.order.lineItems.length; index++) {
  //     this.dateArray.push(this.order.lineItems[index].estimatedEndDate)
  //   }
  //   this.max = this.dateArray.reduce(function (a, b) { return a > b ? a : b; });
  // }

  // public getSubTotal() {
  //   return this.order.lineItems.map(rr => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  // }

}
