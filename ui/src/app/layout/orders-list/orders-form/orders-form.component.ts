import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  TemplateRef,
  ChangeDetectorRef,
  AfterContentInit,
} from '@angular/core';
import { Order } from 'src/app/shared/domain/order.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { ActivatedRoute, Router, Params } from '@angular/router';
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

import { Reason, RejectionReason } from 'src/app/shared/domain/reason.model';
// import { ReasonsService } from 'src/app/shared/services/reasons.service';
import { LineItemService } from 'src/app/shared/services/line-item.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ReasonService } from 'src/app/shared/services/reason.service';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss'],
  animations: [routerTransition()],
})
export class OrdersFormComponent extends DefaultFormComponent<Order, OrderService> {
  breadcrumbs = [
    { heading: 'Orders', icon: 'fa-tasks', link: '/orders-list' },
    { heading: 'orderDetails', icon: 'fa-tasks' },
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
  arrBooleanRejectItems: boolean[] = new Array();
  rejectItems: boolean = true;
  lineItem: LineItem = {} as LineItem;
  // order: Observable<Order>;

  rejectionReason: RejectionReason = {} as RejectionReason;
  reasonList: Reason[] = [{ id: '', name: '', status: '' }];

  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrderService,
    private itemservice: LineItemService,
    route: ActivatedRoute,
    router: Router,
    private alertService: AlertService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private modalService: BsModalService,
    private rejectionReasonService: ReasonService,
    private cd: ChangeDetectorRef
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);

    this.form = this.formBuilder.group({});
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
    });
    this.service.get(this.orderId).subscribe((res: Order) => {
      if (res?.status == 'PENDING') {
        this.isEnabled = false;
      }
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
            this.arrBooleanItems.push(true);
          } else {
            this.arrBooleanItems.push(false);
          }
          if (e.status == 'ITEM_REJECTED') {
            this.arrBooleanRejectItems.push(true);
          } else {
            this.arrBooleanRejectItems.push(false);
          }
        });

        if (this.arrBooleanItems.indexOf(false) == -1) {
          this.check = true;
        } else {
          this.check = false;
        }
        if (this.arrBooleanRejectItems.indexOf(false) == -1) {
          this.rejectItems = false;
        } else {
          this.rejectItems = true;
        }
      });
    });
  }

  ngOnInit() {
    this.loadingService.register(this.key);
    this.route.params.pipe(map((params: Params) => params.entityId)).subscribe((entityId) => {
      if (entityId) {
        this.onUpdate();
        this.service.get(entityId).subscribe((entity) => {
          this.form.patchValue(entity);
          this.entity = entity;
          this.loadingService.resolve(this.key);
          this.entity.lineItems.forEach((e) => {
            if (e.duration == 0) {
              e.duration = undefined;
            }
          });
        });
      } else {
        this.onCreate();
        this.entity = {} as Order;
        this.loadingService.resolve(this.key);
      }
    });
  }

  onItemSelect(item: any) {}
  onItemDeSelect(item) {}
  onSelectAll(items: any) {
    this.selectedItems = items;
  }
  onDeSelectAll(items: any) {
    this.selectedItems = items;
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
    this.loadingService.register(this.key);
    if (lineItem.duration <= 0) {
      lineItem.duration = null;
      this.loadingService.resolve(this.key);
      return;
    }
    if (lineItem.unitPrice <= 0) {
      lineItem.unitPrice = null;
      this.loadingService.resolve(this.key);
      return;
    }

    this.service.updateLineItem(lineItem).subscribe(
      (res: LineItem) => {
        this.toastr.success(this.translate.instant('update.Successful'));
        this.loadingService.resolve(this.key);
        lineItem = res;
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
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
      if (!e.unitPrice || !e.duration) {
        found = false;
      }
    });
    return found;
  }

  orderStatus(order: Order, statusBtn: HTMLElement) {
    this.loadingService.register(this.key);
    let arrLineItems: boolean[] = new Array();

    switch (order.status) {
      case 'PENDING':
        this.service.orderStatus(order.id, 'quote').subscribe((res: Order) => {
          this.entity = res;
          this.isEnabled = true;
          this.loadingService.resolve(this.key);
        });

        break;
      case 'QUOTE_ACCEPTED':
        this.service.orderStatus(order.id, 'process').subscribe((res: Order) => {
          this.entity = res;
          this.loadingService.resolve(this.key);
        });
        break;
      case 'IN_PROGRESS':
        this.service.orderStatus(order.id, 'finish').subscribe((res: Order) => {
          this.entity = res;
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
          this.loadingService.resolve(this.key);
        });

        break;
      case 'FINISHED':
        this.service.orderStatus(order.id, 'deliver').subscribe((res: Order) => {
          this.entity = res;
          this.loadingService.resolve(this.key);
        });
        break;
      case 'Delivered':
        break;
      default:
        break;
    }
  }
  orderReject(order: Order) {
    this.loadingService.register(this.key);
    if (this.selectedItems.length == 0) {
      this.checkReason = false;
      return;
    } else {
      this.checkReason = true;
      this.rejectionReason.reason = this.selectedItems;
      this.entity.rejectionReasons = this.rejectionReason.reason;
      this.entity.rejectionNote = this.rejectionReason.notes;
      this.service.orderReject(order.id, this.entity).subscribe((res: Order) => {
        this.rejectionReason = {} as RejectionReason;
        this.selectedItems = [];
        this.modalRef.hide();
        this.entity = res;
        this.toastr.success('Successful');
        this.isEnabled = true;
        this.loadingService.resolve(this.key);
      });
    }
  }

  lineItemReject(lineItem: LineItem) {
    this.loadingService.register(this.key);
    let arrLineItems: boolean[] = new Array();
    let arrLineItemsReject: boolean[] = new Array();
    if (this.selectedItems.length == 0) {
      this.checkReason = false;
      this.loadingService.resolve(this.key);

      return;
    } else {
      this.checkReason = true;
      this.rejectionReason.reason = this.selectedItems;
      lineItem.rejectionReasons = this.rejectionReason.reason;
      lineItem.rejectionNote = this.rejectionReason.notes;
      this.itemservice.itemReject(lineItem.id, lineItem).subscribe((res: LineItem) => {
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
            if (e.status == 'ITEM_REJECTED') {
              arrLineItemsReject.push(true);
            } else {
              arrLineItemsReject.push(false);
            }
            this.loadingService.resolve(this.key);
          });

          if (arrLineItems.indexOf(false) == -1 && arrLineItemsReject.indexOf(false) != -1) {
            this.found = true;
          } else {
            this.found = false;
          }
        });
      });
    }
  }
  lineItemStatus(lineItem: LineItem) {
    this.loadingService.register(this.key);
    if (!lineItem.duration || !lineItem.unitPrice) {
      this.toastr.error(this.translate.instant('lineItem.update.error'));
      this.loadingService.resolve(this.key);

      return;
    }
    let arrLineItems: boolean[] = new Array();
    let arrBooleanRejectItems: boolean[] = new Array();

    switch (lineItem.status) {
      case 'PENDING':
        this.itemservice.itemStatus(lineItem.id, 'quote').subscribe(
          (itemRes: LineItem) => {
            lineItem.status = itemRes.status;

            this.service.get(this.orderId).subscribe(
              (res: Order) => {
                res.lineItems.forEach((e) => {
                  if (e.status == 'QUOTED' || e.status == 'ITEM_REJECTED' || e.status == 'CANCELLED') {
                    arrLineItems.push(true);
                  } else {
                    arrLineItems.push(false);
                  }
                  if (e.status == 'ITEM_REJECTED') {
                    arrBooleanRejectItems.push(true);
                  } else {
                    arrBooleanRejectItems.push(false);
                  }
                });

                if (arrLineItems.indexOf(false) == -1) {
                  this.found = true;
                } else {
                  this.found = false;
                }
                if (arrBooleanRejectItems.indexOf(false) == -1) {
                  this.rejectItems = false;
                } else {
                  this.rejectItems = true;
                }
                this.loadingService.resolve(this.key);
              },
              (err) => {
                this.loadingService.resolve(this.key);
              }
            );
          },
          (err) => {
            this.loadingService.resolve(this.key);
          }
        );
        break;
      case 'QUOTE_ACCEPTED':
        this.itemservice.itemStatus(lineItem.id, 'process').subscribe((res: LineItem) => {
          lineItem.status = res.status;
          this.loadingService.resolve(this.key);
        });
        break;
      case 'IN_PROGRESS':
        this.itemservice.itemStatus(lineItem.id, 'finish').subscribe((res: LineItem) => {
          lineItem.status = res.status;
          this.checkOrderStatus();
          this.loadingService.resolve(this.key);
        });

        break;
      case 'FINISHED':
        this.itemservice.itemStatus(lineItem.id, 'deliver').subscribe((res: LineItem) => {
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
          this.loadingService.resolve(this.key);
        });

        break;
      case 'Delivered':
        break;
      default:
        break;
    }
  }

  updateItemPending(lineItem: LineItem) {
    this.loadingService.register(this.key);
    this.itemservice.itemStatus(lineItem.id, 'reset').subscribe(
      (res: LineItem) => {
        lineItem.status = 'PENDING';
        this.found = false;
        this.rejectionReason = {} as RejectionReason;
        this.selectedItems = [];
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }

  openModal(template) {
    this.loadingService.register(this.key);
    this.rejectionReasonService.searchTerm = '';
    this.rejectionReasonService.model$.subscribe(
      (res) => {
        this.reasonList = res;
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
    this.modalRef = this.modalService.show(template);
  }
  itemRejectReasonModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  checkOrderStatus() {
    this.loadingService.register(this.key);
    let arrLineItems: boolean[] = new Array();

    this.service.get(this.orderId).subscribe(
      (res: Order) => {
        res.lineItems.forEach((e) => {
          if (
            e.status == 'QUOTED' ||
            e.status == 'ITEM_REJECTED' ||
            e.status == 'CANCELLED' ||
            e.status == 'QUOTE_REJECTED' ||
            e.status == 'FINISHED' ||
            e.status == 'DELIVERED'
          ) {
            arrLineItems.push(true);
          } else {
            arrLineItems.push(false);
          }
        });
        this.loadingService.resolve(this.key);

        if (arrLineItems.indexOf(false) == -1) {
          this.found = true;
        } else {
          this.found = false;
        }
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }
}
