import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/domain';
import { TrackOrdersService } from 'src/app/services';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {

  orders: Array<Order>;

  constructor(private restOrders:TrackOrdersService) { }

  ngOnInit() {

    this.restOrders.getAll().subscribe((orders:Array<Order>)=>{
      this.orders=orders;
    });
}

}
