import { Component, OnInit, Inject, AfterViewInit, TemplateRef } from '@angular/core';
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
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { DatePipe } from '@angular/common';
import * as THREE from 'three/build/three.module.js';
import { ItemsService } from './items.service';
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
  check: boolean = true;
  minDate: Date;
  maxDate: Date;
  isEnabled: boolean = true;
  isButtonVisible: boolean = true;
  modalRef: BsModalRef;
  reasonRejection: string;
  arrBooleanItems: boolean[] = new Array();
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrdersListService,
    private itemservice: ItemsService,
    route: ActivatedRoute,
    router: Router,
    private alertService: AlertService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private modalService: BsModalService
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
      this.checkOrderStatus();
      this.service.get(this.orderId).subscribe((res: Order) => {
        res.lineItems.forEach((e) => {
          if (
            // e.status !== 'FINISHED'
            e.status == 'DELIVERED' ||
            e.status == 'QUOTE_ACCEPTED' ||
            e.status == 'IN_PROGRESS' ||
            e.status == 'QUOTE_REJECTED'
          ) {
            this.arrBooleanItems.push(true);
          } else {
            this.arrBooleanItems.push(false);
          }
        });

        console.log(this.arrBooleanItems);
        if (this.arrBooleanItems.indexOf(false) == -1) {
          this.check = true;
        } else {
          this.check = false;
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
    return this.appConfig.FILE_URL_ADMIN + entity.files[0].asset_id;
  }
  onCreate(): void {}
  onUpdate(): void {}
  cancel(): void {}
  updateItem(order: Order, lineItem: LineItem) {
    console.log(lineItem.estimatedEndDate);
    let arrLineItems: boolean[] = new Array();
    let d = new Date(lineItem.estimatedEndDate);
    d.setMinutes(d.getMinutes() + 480);
    lineItem.estimatedEndDate = d;

    this.service.updateLineItem(lineItem).subscribe((res: LineItem) => {
      this.toastr.success(this.translate.instant('update.Successful'));
      lineItem = res;
    });
  }

  getFileExtension(entity: LineItem) {
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
        this.service.orderStatus(order.id, 'quote').subscribe((res: Order) => {
          this.entity = res;
          this.isEnabled = true;
        });

        break;
      case 'QUOTE_ACCEPTED':
        this.service.orderStatus(order.id, 'process').subscribe((res: Order) => {
          this.entity = res;
        });
        break;
      case 'IN_PROGRESS':
        this.service.orderStatus(order.id, 'finish').subscribe((res: Order) => {
          this.entity = res;
          this.check = false;
        });

        break;
      case 'FINISHED':
        this.service.orderStatus(order.id, 'deliver').subscribe((res: Order) => {
          this.entity = res;
        });
        break;
      case 'Delivered':
        break;
      default:
        break;
    }
  }
  orderReject(order: Order) {
    this.service.orderReject(order.id).subscribe((res: Order) => {
      // this.entity.status = 'ORDER_REJECTED';
      this.entity = res;
      this.toastr.success('Successful');
      this.isEnabled = true;
    });
  }

  lineItemReject(lineItem: LineItem) {
    let arrLineItems: boolean[] = new Array();

    this.itemservice.orderReject(lineItem.id).subscribe((res: LineItem) => {
      lineItem.status = res.status;
      this.toastr.success('Successful');
      this.service.get(this.orderId).subscribe((res: Order) => {
        res.lineItems.forEach((e) => {
          if (e.status == 'QUOTED' || e.status == 'ITEM_REJECTED') {
            arrLineItems.push(true);
          } else {
            arrLineItems.push(false);
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
  }
  lineItemStatus(lineItem: LineItem) {
    if (!lineItem.estimatedEndDate || !lineItem.unitPrice) {
      this.toastr.error(this.translate.instant('lineItem.update.error'));
      return;
    }
    let arrLineItems: boolean[] = new Array();

    switch (lineItem.status) {
      case 'PENDING':
        this.itemservice.orderStatus(lineItem.id, 'quote').subscribe((itemRes: LineItem) => {
          lineItem.status = itemRes.status;

          this.service.get(this.orderId).subscribe((res: Order) => {
            res.lineItems.forEach((e) => {
              if (e.status == 'QUOTED' || e.status == 'ITEM_REJECTED' || e.status == 'CANCELLED') {
                arrLineItems.push(true);
              } else {
                arrLineItems.push(false);
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
        break;
      case 'QUOTE_ACCEPTED':
        this.itemservice.orderStatus(lineItem.id, 'process').subscribe((res: LineItem) => {
          lineItem.status = res.status;
        });
        break;
      case 'IN_PROGRESS':
        this.itemservice.orderStatus(lineItem.id, 'finish').subscribe((res: LineItem) => {
          lineItem.status = res.status;
          this.checkOrderStatus();
        });

        break;
      case 'FINISHED':
        this.itemservice.orderStatus(lineItem.id, 'deliver').subscribe((res: LineItem) => {
          lineItem.status = res.status;
          this.checkOrderStatus();
          this.service.get(this.orderId).subscribe((res: Order) => {
            res.lineItems.forEach((e) => {
              if (
                e.status == 'DELIVERED' ||
                e.status == 'QUOTE_ACCEPTED' ||
                e.status == 'IN_PROGRESS' ||
                e.status == 'QUOTE_REJECTED'
              ) {
                arrLineItems.push(true);
              } else {
                arrLineItems.push(false);
              }
            });

            if (arrLineItems.indexOf(false) == -1) {
              this.check = true;
            } else {
              this.check = false;
            }
          });
          // this.check = true;
        });

        break;
      case 'Delivered':
        break;
      default:
        break;
    }
  }

  updateItemPending(lineItem: LineItem) {
    this.itemservice.orderStatus(lineItem.id, 'reset').subscribe((res: LineItem) => {
      lineItem.status = 'PENDING';
      this.found = false;
      console.log(res);
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  checkOrderStatus() {
    let arrLineItems: boolean[] = new Array();

    this.service.get(this.orderId).subscribe((res: Order) => {
      res.lineItems.forEach((e) => {
        if (
          e.status == 'QUOTED' ||
          e.status == 'ITEM_REJECTED' ||
          e.status == 'CANCELLED' ||
          e.status == 'QUOTE_REJECTED' ||
          e.status == 'FINISHED' ||
          e.status == 'DELIVERED'
          // e.status == 'QUOTE_ACCEPTED' ||
          // e.status == 'IN_PROGRESS'
          // e.status == 'QUOTE_REJECTED'
        ) {
          arrLineItems.push(true);
        } else {
          arrLineItems.push(false);
        }
      });

      if (arrLineItems.indexOf(false) == -1) {
        this.found = true;
      } else {
        this.found = false;
      }
    });
  }
}
