import { Component, OnInit,Input } from '@angular/core';
import { Order, LineItem } from 'src/app/domain';
import { OrdersService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css']
})
export class OrderCardComponent implements OnInit {

  @Input() order : Order;

  // orderitem = new Order();


  constructor(private orderService:OrdersService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit() {
  }

  // Order Status Cases

  WaitingForQuotation() {
    // Waiting For Quotation
    return (this.order.status == 'WAIT_QUOTE');
  }

  WaitingForApproval() {
    // Waiting For Approval
    return (this.order.status == 'Waiting For Approval');
  }

  // Approve Quotation
  quotationApproved() {
    return (this.order.status == 'AQ');
  }

  quotationRejected() {
    // Waiting For Approval
    return (this.order.status == 'Rejected');
  }

  InProgress() {
    // In Progress
    return (this.order.status == 'In Progress');
  }

  Finished() {
    return (this.order.status == 'Finished Partially');
  }

  Delivered() {
    return (this.order.status == 'Delivered');
  }

  Cancelled() {
    return (this.order.status == 'Cancelled');
  }

  // cancelOrder(id) {
  // //  this.order.status = "canceled";
  //   return this.orderService.updateOrder(this.order).subscribe(
  //     res=>{ console.log(res)},
  //     err=>{}
  //   );
  // }

  cancelOrder() {
    // const order = Object.assign({},this.order);
    // order.status="Cancelled";
    // this.orderService.update(id, order).subscribe(
    //   res=>{this.router.navigateByUrl('/orders')}
    // )
    this.orderService.cancel(this.order.id).subscribe(res=>this.order=res);
  }

  approveQuotation() {
    // const order = Object.assign({},this.order);
    // order.status="In Progress";
    // this.orderService.update(id, this.order).subscribe(
    //   res=>{this.router.navigateByUrl('/orders')}
    // )
    this.orderService.approve(this.order.id).subscribe(
      res=>this.order=res
    );
  }

  rejectQuotation() {
    // const order = Object.assign({},this.order);
    // order.status="Rejected";
    // this.orderService.update(id, this.order).subscribe(
    //   res=>{this.router.navigateByUrl('/orders')}
    // )
    this.orderService.reject(this.order.id).subscribe(
      res=>this.order=res
    );
  }
}
