import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/domain';
import { OrdersService } from 'src/app/services';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {

  orders: Array<Order>;

  constructor(private ordersService:OrdersService) { }

  ngOnInit() {

    this.ordersService.query<Order[]>().subscribe(orders=>this.orders= orders);
}

}
