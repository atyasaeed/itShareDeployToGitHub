import { Component, OnInit,Input } from '@angular/core';
import { Order, LineItem } from 'src/app/domain';
import { TrackOrdersService } from 'src/app/services';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css']
})
export class OrderCardComponent implements OnInit {

  @Input() order : Order;


  constructor() { }

  ngOnInit() {
  }

  // Order Status Cases

  WaitingForQuotation() {
    return (this.order.status == 'Waiting For Quotation');
  }

  WaitingForApproval() {
    return (this.order.status == 'Waiting For Approval');
  }

  InProgress() {
    return (this.order.status == 'In Progress');
  }

  Finished() {
    return (this.order.status == 'Finished');
  }

  Delivered() {
    return (this.order.status == 'Delivered');
  }

  Canceled() {
    return (this.order.status == 'Canceled');
  }
}
