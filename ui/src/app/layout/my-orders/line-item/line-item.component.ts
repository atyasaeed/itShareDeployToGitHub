import { Component, OnInit, Input, Inject, TemplateRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LineItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as THREE from 'three/build/three.module.js';
//import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LineItemService } from '../../../shared/services/line-item.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

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
  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    //private http: HttpClient,
    private toastr: ToastrService,
    private service: LineItemService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    if (this.lineItem.status == 'QUOTE_ACCEPTED' || this.lineItem.status == 'QUOTED') {
      this.checkRadio = 'accept';
    } else if (this.lineItem.status == 'QUOTE_REJECTED') {
      this.checkRadio = 'reject';
    }
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

  // checkStatus() {
  //   let result = '';
  //   switch (this.orderStatus) {
  //     case 'PENDING':
  //       result = 'PENDING';
  //       break;
  //     case 'CANCELLED':
  //       result = 'CANCELLED';
  //       break;
  //     case 'QUOTED':
  //       result = 'QUOTED';
  //       break;
  //     case 'QUOTE_ACCEPTED':
  //       result = 'QUOTE_ACCEPTED';
  //       break;
  //     case 'QUOTE_REJECTED':
  //       result = 'QUOTE_REJECTED';
  //       break;
  //     case 'ORDER_REJECTED':
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

  cancelItem() {
    this.service.cancel(this.lineItem.id).subscribe((res: LineItem) => {
      this.lineItem = res;
      this.itemChanged.emit(res);
      this.toastr.success('Item Cancelled');
      this.modalRef.hide();
    });
  }

  quotedActionsChanged(event) {
    if (event.target.value == 'QUOTE_ACCEPTED') {
      this.service.approve(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.itemChanged.emit(res);
        this.toastr.success('Quote Accepted');
      });
    } else if (event.target.value == 'QUOTE_REJECTED') {
      this.service.reject(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.itemChanged.emit(res);
        this.toastr.success('Quote Rejected');
      });
    }
  }

  cancelModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  itemRejectReasonModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  showTerminatedOverlay() {
    if (this.lineItem.status == 'CANCELLED') {
      return true;
    } else if (this.lineItem.status == 'QUOTE_REJECTED' && this.orderStatus != 'QUOTED') {
      return true;
    } else if (this.lineItem.status == 'ITEM_REJECTED' && this.orderStatus != 'PENDING') {
      return true;
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
}
