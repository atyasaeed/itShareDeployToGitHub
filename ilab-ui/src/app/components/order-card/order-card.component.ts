import { Component, OnInit, Input } from '@angular/core';
import { Order, LineItem } from 'src/app/domain';
import { OrdersService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input() order: Order;

  // orderitem = new Order();

  constructor(private orderService: OrdersService, private route: ActivatedRoute, private router: Router) {}
max:any

dateArray:any []=[] ;
  ngOnInit() {
this.getDeliveryDate()
  }

  getDeliveryDate(){
    for (let index = 0; index < this.order.lineItems.length; index++) {

      this.dateArray.push(this.order.lineItems[index].estimatedEndDate)
    }
    console.log(this.dateArray);
    this.max = this.dateArray.reduce(function (a, b) { return a > b ? a : b; });
  }
  // Check Order Status Cases

  WaitingForQuotation() {
    // Waiting For Quotation
    return this.order.status == 'WAIT_QUOTE';
  }

  WaitingForApproval() {
    // Waiting For Approval
    return this.order.status == 'WAIT_CONFIRMATION';
  }

  // Approve Quotation
  quotationApproved() {
    return this.order.status == 'AQ';
  }

  quotationRejected() {
    // Waiting For Approval
    return this.order.status == 'REJECT_QUOTE';
  }

  rejectOrder() {
    return this.order.status == 'REJECT_ORDER';
  }

  InProgress() {
    // In Progress
    return this.order.status == 'IN_PROGRESS';
  }

  Finished() {
    return this.order.status == 'FINISHED';
  }

  partiallyFinished() {
    return this.order.status == 'PARTIALLY_FINISHED';
  }

  Delivered() {
    return this.order.status == 'DELIVERED';
  }

  partiallyDelivered() {
    return this.order.status == 'PARIALLY_DELIVERED';
  }

  Cancelled() {
    return this.order.status == 'CANCELLED';
  }

  shoppingCart() {
    return this.order.status == 'SHOPPING_CART';
  }

  wishList() {
    return this.order.status == 'WISH_LIST';
  }

  pending() {
    return this.order.status == 'PENDING';
  }
  // End Check Order Status Cases

  // Client actions on his orders
  cancelOrder() {
    this.orderService.cancel(this.order.id).subscribe(res => (this.order = res));
  }

  approveQuotation() {
    this.orderService.approve(this.order.id).subscribe(res => (this.order = res));
  }

  rejectQuotation() {
    this.orderService.reject(this.order.id).subscribe(res => (this.order = res));
  }


  public getSubTotal() {
    return this.order.lineItems.map(rr=>rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }
}
