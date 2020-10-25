import { Component, OnInit, Input, ChangeDetectorRef, Inject, TemplateRef } from '@angular/core';
import { Order, User, LineItem } from 'src/app/shared/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { IAppConfig, APP_CONFIG } from 'src/app/shared/app.config';
import { HttpClient } from '@angular/common/http';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from 'src/app/shared/services/user.service';
import { TdLoadingService } from '@covalent/core/loading';
import { getLang } from 'src/app/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-card',
  templateUrl: './my-order-card.component.html',
  styleUrls: ['./my-order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  @Input() order: Order;
  statusArr: string[] = ['PENDING', 'QUOTED', 'QUOTE_ACCEPTED', 'IN_PROGRESS', 'FINISHED', 'DELIVERED'];
  user: User;
  subTotal: number;
  maxDuration: number;
  ordersDurationArray: number[] = [];
  modalRef: BsModalRef;
  otherKey = 'loadingOrder';
  orderEndDate: Date;
  lang: string;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private http: HttpClient,
    private modalService: BsModalService,
    private userService: UserService,
    private loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit() {
    this.userService.getAuthUserDetails().subscribe(
      (user) => {
        this.user = user;
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  ngAfterViewInit() {
    this.printSubTotal(this.order.lineItems);
    this.getMaxOrderDuration(this.order.lineItems);
    this.getOrderEstimatedEndDate();
    this.cdr.detectChanges();
  }

  getMaxOrderDuration(lineItems: LineItem[]) {
    this.ordersDurationArray = [];
    for (let index = 0; index < lineItems.length; index++) {
      if (
        lineItems[index].status == 'QUOTED' ||
        lineItems[index].status == 'QUOTE_ACCEPTED' ||
        lineItems[index].status == 'IN_PROGRESS' ||
        lineItems[index].status == 'FINISHED' ||
        lineItems[index].status == 'DELIVERED'
      ) {
        this.ordersDurationArray.push(lineItems[index].duration);
      }
    }

    if (this.ordersDurationArray.length > 0) {
      this.maxDuration = this.ordersDurationArray.reduce((a: number, b: number) => {
        return a > b ? a : b;
      });
    } else {
      this.maxDuration = 0;
    }
  }

  cancelOrder() {
    this.loadingService.register(this.otherKey);
    this.orderService.cancel(this.order.id).subscribe(
      (res) => {
        this.order = res;
        this.loadingService.resolve(this.otherKey);
      },
      (err) => {
        this.loadingService.resolve(this.otherKey);
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  approveQuotation() {
    this.loadingService.register(this.otherKey);
    this.orderService.approve(this.order.id).subscribe(
      (res) => {
        this.order = res;
        this.loadingService.resolve(this.otherKey);
      },
      (err) => {
        this.loadingService.resolve(this.otherKey);
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  rejectQuotation() {
    this.loadingService.register(this.otherKey);
    this.orderService.reject(this.order.id).subscribe(
      (res) => {
        this.order = res;
        this.loadingService.resolve(this.otherKey);
      },
      (err) => {
        this.loadingService.resolve(this.otherKey);
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  getOrder(lineItem: LineItem) {
    this.order.lineItems.forEach((e: LineItem, index) => {
      if (e.id == lineItem.id) {
        this.order.lineItems[index] = lineItem;
      }
    });
    this.printSubTotal(this.order.lineItems);
    this.getMaxOrderDuration(this.order.lineItems);
    this.getOrderEstimatedEndDate();
  }

  printSubTotal(arr: LineItem[]) {
    this.subTotal = 0;
    for (let i = 0; i < arr.length; i++) {
      if (
        arr[i].status == 'QUOTED' ||
        arr[i].status == 'QUOTE_ACCEPTED' ||
        arr[i].status == 'IN_PROGRESS' ||
        arr[i].status == 'FINISHED' ||
        arr[i].status == 'DELIVERED'
      ) {
        this.subTotal += arr[i].unitPrice * arr[i].quantity;
      }
    }
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

  getOrderEstimatedEndDate() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.maxDuration);
    if (this.maxDuration !== 0) {
      this.orderEndDate = currentDate;
    } else {
      this.orderEndDate = null;
    }
  }

  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }
}
