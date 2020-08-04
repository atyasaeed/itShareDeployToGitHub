import { Component, OnInit, Inject, AfterViewInit, TemplateRef } from '@angular/core';
import { Order } from 'src/app/shared/domain/order.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrdersListService } from '../../orders-list/orders-list.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { AlertService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { LineItem } from 'src/app/shared/domain';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { DatePipe } from '@angular/common';
import * as THREE from 'three/build/three.module.js';
import { ItemsService } from './items.service';
import { Reason, RejectionReason } from 'src/app/shared/domain/reason.model';
import { ReasonService } from 'src/app/shared/services/reason.service';
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
  checkReason: boolean = true;
  minDate: Date;
  maxDate: Date;
  isEnabled: boolean = true;
  isButtonVisible: boolean = true;
  modalRef: BsModalRef;
  reasonRejection: string;
  arrBooleanItems: boolean[] = new Array();
  rejectionReason: RejectionReason = {} as RejectionReason;
  reasonList: Reason[] = [{ id: '', name: '', status: '' }];

  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
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
    private modalService: BsModalService,
    private rejectionReasonService: ReasonService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      // id: [{ value: '', disabled: true }],
    });

    // this.rejectionReasonService.getReasons().subscribe((res) => {
    //   console.log(res);
    // });

    // this.reasonList = [
    //   { id: '1', name: 'reason1', status: 'ac' },
    //   { id: '2', name: 'reason2', status: 'ac' },
    //   { id: '3', name: 'reason3', status: 'ac' },
    //   { id: '4', name: 'reason4', status: 'ac4' },
    // ];

    this.dropdownSettings = {
      idField: 'id',
      textField: 'name',
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.minDate = new Date();
    this.activatedRoute.params.subscribe((paramsId) => {
      this.orderId = paramsId.entityId;
      console.log(this.orderId);
    });
    this.service.get(this.orderId).subscribe((res: Order) => {
      // this.checkLineItems(this.orderId, res.lineItems);
      if (res?.status == 'PENDING') {
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
            e.status == 'QUOTE_REJECTED' ||
            e.status == 'ITEM_REJECTED' ||
            e.status == 'CANCELLED'
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
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onItemDeSelect(item) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedItems = items;
    console.log(this.selectedItems);
  }
  onDeSelectAll(items: any) {
    console.log(items);
    this.selectedItems = items;

    console.log(this.selectedItems);
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
    let arrLineItems: boolean[] = new Array();

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
          res.lineItems.forEach((e) => {
            if (
              // e.status !== 'FINISHED'
              e.status == 'DELIVERED' ||
              e.status == 'QUOTE_ACCEPTED' ||
              e.status == 'IN_PROGRESS' ||
              e.status == 'QUOTE_REJECTED' ||
              e.status == 'ITEM_REJECTED' ||
              e.status == 'CANCELLED'
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
    if (this.selectedItems.length == 0) {
      // this.toastr.error(this.translate.instant('reason.error.select'));
      this.checkReason = false;
      return;
    } else {
      this.checkReason = true;
      this.rejectionReason.reason = this.selectedItems;
      this.entity.rejectionReasons = this.rejectionReason.reason;
      this.entity.rejectionNote = this.rejectionReason.notes;
      this.service.orderReject(order.id, this.entity).subscribe((res: Order) => {
        // this.entity.status = 'ORDER_REJECTED';
        this.rejectionReason = {} as RejectionReason;
        this.selectedItems = [];
        this.modalRef.hide();
        this.entity = res;
        this.toastr.success('Successful');
        this.isEnabled = true;
      });
    }
  }

  lineItemReject(lineItem: LineItem) {
    let arrLineItems: boolean[] = new Array();
    if (this.selectedItems.length == 0) {
      // this.toastr.error(this.translate.instant('reason.error.select'));
      this.checkReason = false;
      return;
    } else {
      this.checkReason = true;
      this.rejectionReason.reason = this.selectedItems;
      lineItem.rejectionReasons = this.rejectionReason.reason;
      lineItem.rejectionNote = this.rejectionReason.notes;
      console.log(this.rejectionReason);
      this.itemservice.orderReject(lineItem.id, lineItem).subscribe((res: LineItem) => {
        this.rejectionReason = {} as RejectionReason;
        this.selectedItems = [];
        this.modalRef.hide();
        lineItem.status = res.status;
        this.toastr.success(this.translate.instant('Successful'));
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
                e.status == 'QUOTE_REJECTED' ||
                e.status == 'ITEM_REJECTED' ||
                e.status == 'CANCELLED'
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
      this.rejectionReason = {} as RejectionReason;
      this.selectedItems = [];
    });
  }

  openModal(template: TemplateRef<any>) {
    // this.rejectionReasonService.searchUrl = 'search';
    this.rejectionReasonService.searchTerm = '';
    this.rejectionReasonService.model$.subscribe((res) => {
      console.log(res);
      this.reasonList = res;
    });
    this.modalRef = this.modalService.show(template);
  }
  itemRejectReasonModal(template: TemplateRef<any>) {
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
