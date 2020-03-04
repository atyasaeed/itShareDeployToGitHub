import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/domain';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  constructor(private orderService: OrderService) { }
  orders: Array<Order>;
  // status: string;
  ngOnInit() {
    this.orderService.query<Order[]>().subscribe(orders => (this.orders = orders));
  }
}
