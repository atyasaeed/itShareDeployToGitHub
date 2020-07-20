import { Component, OnInit, Input, Inject, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { LineItem, ShoppingCartItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as THREE from 'three/build/three.module.js';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LineItemService } from './line-item.service';
@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {
  @Input() lineItem: LineItem;
  @Input() status: string;
  //@ViewChildren('acceptRef', { read: ElementRef }) acceptRef: QueryList<ElementRef<HTMLParagraphElement>>;
  // @ViewChild('acceptRef') acceptRef: ElementRef;
  // @ViewChild('rejectRef') rejectRef: ElementRef;
  // @ViewChild('cancelRef') cancelRef: ElementRef;
  checkRadio;
  constructor(
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: LineItemService
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    // if (this.lineItem.status == 'CANCELLED') {
    //   //this.cancelRef.nativeElement.checked = true;
    //   this.checkRadio = 'cancel';
    // }
    if (this.lineItem.status == 'QUOTE_ACCEPTED' || this.lineItem.status == 'QUOTED') {
      this.checkRadio = 'accept';
    } else if (this.lineItem.status == 'QUOTE_REJECTED') {
      this.checkRadio = 'reject';
    }
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

  checkStatus() {
    let result = '';
    //this.order.status = 'FINISHED';
    switch (this.status) {
      case 'PENDING':
        result = 'PENDING';
        break;
      case 'CANCELLED':
        result = 'CANCELLED';
        break;
      case 'QUOTED':
        result = 'QUOTED';
        break;
      case 'QUOTE_ACCEPTED':
        result = 'QUOTE_ACCEPTED';
        break;
      case 'QUOTE_REJECTED':
        result = 'QUOTE_REJECTED';
        break;
      case 'ORDER_REJECTED':
        result = 'ORDER_REJECTED';
        break;
      case 'IN_PROGRESS':
        result = 'IN_PROGRESS';
        break;
      case 'FINISHED':
        result = 'FINISHED';
        break;
      case 'DELIVERED':
        result = 'DELIVERED';
        break;
      default:
        result = '';
    }
    return result;
  }

  cancelItem() {
    //console.log(this.lineItem);
    if (confirm('Are You Sure ?')) {
      this.service.cancel(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.toastr.success('Item Cancelled');
      });
    }
  }

  quotedActionsChanged(event) {
    if (event.target.value == 'QUOTE_ACCEPTED') {
      this.service.approve(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.toastr.success('Quote Accepted');
      });
    } else if (event.target.value == 'QUOTE_REJECTED') {
      this.service.reject(this.lineItem.id).subscribe((res: LineItem) => {
        this.lineItem = res;
        this.toastr.success('Quote Rejected');
      });
    }
    // else if (event.target.value == 'CANCELLED') {
    //   this.service.cancel(this.lineItem.id).subscribe((res: LineItem) => {
    //     this.lineItem = res;
    //     this.toastr.success('Item Cancelled');
    //   });
    // }
  }
}
