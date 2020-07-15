import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/shared/domain/order.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrdersListService } from '../../orders-list/orders-list.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ProfileService } from '../../profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { AlertService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { LineItem } from 'src/app/shared/domain';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import * as THREE from 'three/build/three.module.js';
@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss'],
  animations: [routerTransition()],
})
export class OrdersFormComponent extends DefaultFormComponent<Order, OrdersListService> {
  breadcrumbs = [
    { heading: 'Orders', icon: 'fa-tasks', link: '/orders-list' },
    { heading: 'Order-Details', icon: 'fa-tasks' },
  ];
  orderId;
  found: boolean = true;
  minDate: Date;
  maxDate: Date;
  isEnabled: boolean = true;
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrdersListService,
    route: ActivatedRoute,
    router: Router,
    private alertService: AlertService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      // id: [{ value: '', disabled: true }],
    });
    this.minDate = new Date();
    this.activatedRoute.params.subscribe((paramsId) => {
      this.orderId = paramsId.entityId;
      console.log(this.orderId);
    });
    this.service.get(this.orderId).subscribe((res: Order) => {
      // this.checkLineItems(this.orderId, res.lineItems);
      if (res.status == 'PENDING') {
        this.isEnabled = false;
      }
      res.lineItems.forEach((e) => {
        if (!e.unitPrice || !e.estimatedEndDate) {
          this.found = false;
        }
      });
    });
  }

  public getSubTotal(lineItems: LineItem[]) {
    let sum = 0;
    lineItems.forEach((e) => {
      if (e.unitPrice) {
        sum += e.unitPrice;
      }
    });

    return sum;
    // return lineItems.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }
  getFileUrl(entity: LineItem): string {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    return this.appConfig.FILE_URL_ADMIN + entity.files[0].asset_id;
  }
  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    // this.router.navigateByUrl(this.breadcrumbs[0].link);
  }
  updateItem(order: Order, lineItem: LineItem) {
    console.log(lineItem.estimatedEndDate);
    let arrLineItems: boolean[] = new Array();
    let d = new Date(lineItem.estimatedEndDate);
    d.setMinutes(d.getMinutes() + 480);
    lineItem.estimatedEndDate = d;

    this.service.updateLineItem(lineItem).subscribe((res) => {
      this.toastr.success(this.translate.instant('update.Successful'));

      this.service.get(this.orderId).subscribe((res: Order) => {
        // this.checkLineItems(this.orderId, res.lineItems);
        res.lineItems.forEach((e) => {
          if (!e.unitPrice || !e.estimatedEndDate) {
            arrLineItems.push(false);
          } else {
            arrLineItems.push(true);
          }
        });

        console.log(arrLineItems);
        if (arrLineItems.indexOf(false) == -1) {
          this.found = true;
        } else {
          this.found = false;
        }
      });
    });

    //  else {
    //   this.toastr.error(this.translate.instant('order.item.error.required'));
    // }
  }

  // getFileExtension(entity: LineItem) {
  //   //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
  //   let extension = entity.files[0].asset_name.split('.');
  //   if (
  //     extension[extension.length - 1].toLowerCase() == 'png' ||
  //     extension[extension.length - 1].toLowerCase() == 'jpg'
  //   ) {
  //     return this.appConfig.FILE_URL_ADMIN + entity.files[0].asset_id;
  //   } else {
  //     return false;
  //   }
  // }
  getFileExtension(entity: LineItem) {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return 'image';
    } else if (extension[extension.length - 1].toLowerCase() == 'stl') {
      return 'stl';
    } else {
      return null;
    }
  }
  checkLineItems(id, lineItems: LineItem[]) {
    let found = true;
    lineItems.forEach((e) => {
      if (!e.unitPrice || !e.estimatedEndDate) {
        found = false;
      }
    });
    return found;
  }

  orderStatus(order: Order, statusBtn: HTMLElement) {
    switch (order.status) {
      case 'PENDING':
        this.service.orderStatus(order.id, 'quote').subscribe((res) => {
          this.entity.status = 'QUOTED';
          this.isEnabled = true;
          // this.entity.status = 'QUOTE_ACCEPTED';

          // this.toastr.success('Successful');
        });
        break;
      case 'QUOTE_ACCEPTED':
        this.service.orderStatus(order.id, 'process').subscribe((res) => {
          this.entity.status = 'IN_PROGRESS';
          // this.toastr.success('Successful');
        });
        break;
      case 'IN_PROGRESS':
        // statusBtn.innerText = 'In Progress';
        this.service.orderStatus(order.id, 'finish').subscribe((res) => {
          this.entity.status = 'FINISHED';
          // this.toastr.success('Successful');
        });

        break;
      case 'FINISHED':
        this.service.orderStatus(order.id, 'deliver').subscribe((res) => {
          this.entity.status = 'DELIVERED';
          // this.toastr.success('Successful');
        });
        break;
      case 'Delivered':
        // statusBtn.innerText = '';
        // this.entity.status = 'Delivered';
        break;
      default:
        break;
    }
  }
  orderReject(order: Order) {
    this.service.orderReject(order.id).subscribe((res) => {
      this.entity.status = 'ORDER_REJECTED';
      this.toastr.success('Successful');
      this.isEnabled = true;
    });
  }
}
