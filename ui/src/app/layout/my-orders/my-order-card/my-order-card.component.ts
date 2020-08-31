import { Component, OnInit, Input, ChangeDetectorRef, Inject, TemplateRef } from '@angular/core';
import { Order, User, LineItem } from 'src/app/shared/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { IAppConfig, APP_CONFIG } from 'src/app/shared/app.config';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from 'src/app/shared/services/user.service';
import { TdLoadingService } from '@covalent/core/loading';

@Component({
  selector: 'app-order-card',
  templateUrl: './my-order-card.component.html',
  styleUrls: ['./my-order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  @Input() order: Order;
  //@ViewChild('statusBtn') statusBtn: HTMLElement;
  // orderitem = new Order();
  statusArr: string[] = ['PENDING', 'QUOTED', 'QUOTE_ACCEPTED', 'IN_PROGRESS', 'FINISHED', 'DELIVERED'];
  user: User;
  subTotal: number;
  max: Date;
  dateArray: Date[] = [];
  modalRef: BsModalRef;
  otherKey = 'loadingOrder';
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private http: HttpClient,
    private modalService: BsModalService,
    private userService: UserService,
    private loadingService: TdLoadingService
  ) {}

  ngOnInit() {
    this.userService.getAuthUserDetails().subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    this.printSubTotal(this.order.lineItems);
    this.getDeliveryDate(this.order.lineItems);
    this.cdr.detectChanges();
  }

  getDeliveryDate(lineItems: LineItem[]) {
    // tslint:disable-next-line:prefer-for-of
    this.dateArray = [];
    for (let index = 0; index < lineItems.length; index++) {
      if (lineItems[index].status == 'QUOTED' || lineItems[index].status == 'QUOTE_ACCEPTED') {
        this.dateArray.push(lineItems[index].estimatedEndDate);
      }
    }
    // console.log(this.dateArray);
    // tslint:disable-next-line:only-arrow-functions
    if (this.dateArray.length > 0) {
      this.max = this.dateArray.reduce(function (a: Date, b: Date) {
        return a > b ? a : b;
      });
    } else {
      this.max = null;
    }
  }

  cancelOrder() {
    this.loadingService.register(this.otherKey);
    this.orderService.cancel(this.order.id).subscribe((res) => {
      this.order = res;
      this.loadingService.resolve(this.otherKey);

      //console.log(res);
    });
  }

  approveQuotation() {
    this.loadingService.register(this.otherKey);
    this.orderService.approve(this.order.id).subscribe((res) => {
      this.order = res;
      this.loadingService.resolve(this.otherKey);
    });
  }

  rejectQuotation() {
    this.loadingService.register(this.otherKey);
    this.orderService.reject(this.order.id).subscribe((res) => {
      this.order = res;
      this.loadingService.resolve(this.otherKey);
    });
  }

  // public getSubTotal() {
  //   return this.order.lineItems.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  // }

  // checkStatus() {
  //   let result = '';
  //   //this.order.status = 'FINISHED';
  //   switch (this.order.status) {
  //     case 'PENDING':
  //       result = 'PENDING';
  //       break;
  //     case 'CANCELLED':
  //       result = 'CANCELLED';
  //       break;
  //     case 'QUOTED':
  //       //this.statusBtn.innerText = 'aprove';
  //       result = 'QUOTED';
  //       break;
  //     case 'QUOTE_ACCEPTED':
  //       //this.statusBtn.innerText = 'aprove';
  //       result = 'QUOTE_ACCEPTED';
  //       break;
  //     case 'QUOTE_REJECTED':
  //       //this.statusBtn.innerText = 'aprove';
  //       result = 'QUOTE_REJECTED';
  //       break;
  //     case 'ORDER_REJECTED':
  //       //this.statusBtn.innerText = 'aprove';
  //       result = 'ORDER_REJECTED';
  //       break;
  //     case 'IN_PROGRESS':
  //       result = 'IN_PROGRESS';
  //       break;
  //     case 'FINISHED':
  //       result = 'FINISHED';
  //       break;
  //     case 'DELIVERED':
  //       result = 'DELIVERED';
  //       break;
  //     default:
  //       result = '';
  //   }
  //   return result;
  // }

  getOrder(lineItem: LineItem) {
    this.order.lineItems.forEach((e: LineItem, index) => {
      if (e.id == lineItem.id) {
        this.order.lineItems[index] = lineItem;
      }
    });
    this.printSubTotal(this.order.lineItems);
    this.getDeliveryDate(this.order.lineItems);
  }

  printSubTotal(arr: LineItem[]) {
    this.subTotal = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].status == 'QUOTED' || arr[i].status == 'QUOTE_ACCEPTED') {
        this.subTotal += arr[i].unitPrice * arr[i].quantity;
      }
    }
  }

  orderRejectReasonModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  showPriceAndEndDate() {
    if (this.order.status != 'PENDING' && this.order.status != 'CANCELLED' && this.order.status != 'ORDER_REJECTED') {
      return true;
    }
    return false;
  }

  showStatusBreadcrumb() {
    if (
      this.order.status != 'CANCELLED' &&
      this.order.status != 'ORDER_REJECTED' &&
      this.order.status != 'QUOTE_REJECTED' &&
      this.order.status != 'QUOTE_EXPIRED'
    ) {
      return true;
    }
    return false;
  }

  showOrderInteractBtns() {
    if (this.order.status == 'PENDING' || this.order.status == 'QUOTE_ACCEPTED' || this.order.status == 'QUOTED') {
      return true;
    }
    return false;
  }

  showCancelOrderBtn() {
    if (this.order.status != 'IN_PROGRESS' && this.order.status != 'FINISHED' && this.order.status != 'DELIVERED') {
      return true;
    }
    return false;
  }
}