import { Component, OnInit, Input, Inject, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LineItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as THREE from 'three/build/three.module.js';
//import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LineItemService } from '../../../shared/services/line-item.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {
  @Input() lineItem: LineItem;
  @Input() orderStatus: string;
  @Output() itemChanged = new EventEmitter<LineItem>();
  checkRadio;
  modalRef: BsModalRef;
  key = 'loadingItem';
  itemEndDate: Date;
  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private translate: TranslateService,
    private toastr: ToastrService,
    private service: LineItemService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private loadingService: TdLoadingService
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    if (this.lineItem.status == 'QUOTE_ACCEPTED' || this.lineItem.status == 'QUOTED') {
      this.checkRadio = 'accept';
    } else if (this.lineItem.status == 'QUOTE_REJECTED') {
      this.checkRadio = 'reject';
    }
    this.getItemEstimatedEndDate();
    this.cdr.detectChanges();
  }

  getFileUrl(): string {
    return this.appConfig.FILE_URL + this.lineItem.files[0].asset_id;
  }

  getFileExtension() {
    let extension = this.lineItem.files[0].asset_name.split('.');
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

  cancelItem() {
    this.loadingService.register(this.key);
    this.service.cancel(this.lineItem.id).subscribe(
      (res: LineItem) => {
        this.lineItem = res;
        this.itemChanged.emit(res);
        this.toastr.success('Item Cancelled');
        this.modalRef.hide();
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  quotedActionsChanged(event) {
    this.loadingService.register(this.key);
    if (event.target.value == 'QUOTE_ACCEPTED') {
      this.service.approve(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.itemChanged.emit(res);
        this.toastr.success('Quote Accepted');
        this.loadingService.resolve(this.key);
      });
    } else if (event.target.value == 'QUOTE_REJECTED') {
      this.service.reject(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.itemChanged.emit(res);
        this.toastr.success('Quote Rejected');
        this.loadingService.resolve(this.key);
      });
    }
  }

  cancelItemModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  itemRejectReasonModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  showTerminatedOverlay() {
    if (
      this.orderStatus != 'CANCELLED' &&
      this.orderStatus != 'ORDER_REJECTED' &&
      this.orderStatus != 'QUOTE_REJECTED' &&
      this.orderStatus != 'QUOTE_EXPIRED'
    ) {
      if (this.lineItem.status == 'CANCELLED') {
        return true;
      } else if (this.lineItem.status == 'QUOTE_REJECTED' && this.orderStatus != 'QUOTED') {
        return true;
      } else if (this.lineItem.status == 'ITEM_REJECTED' && this.orderStatus != 'PENDING') {
        return true;
      }
    }

    return false;
  }

  showAfterInProgressStatus() {
    if (
      this.lineItem.status == 'IN_PROGRESS' ||
      this.lineItem.status == 'FINISHED' ||
      this.lineItem.status == 'DELIVERED'
    ) {
      return true;
    }
    return false;
  }

  showApproveRejectQuote() {
    if (
      this.orderStatus == 'QUOTED' &&
      this.lineItem.status != 'CANCELLED' &&
      this.lineItem.status != 'ITEM_REJECTED'
    ) {
      return true;
    }
    return false;
  }

  showCancelItemBtn() {
    if (!(this.lineItem.status == 'CANCELLED')) {
      if (
        this.orderStatus == 'PENDING' ||
        (this.orderStatus == 'QUOTED' && this.lineItem.status != 'ITEM_REJECTED') ||
        (this.orderStatus == 'QUOTE_ACCEPTED' && this.lineItem.status == 'QUOTE_ACCEPTED')
      ) {
        return true;
      }
    }
    return false;
  }

  getItemEstimatedEndDate() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + this.lineItem.duration);

    this.itemEndDate = currentDate;
  }
}
