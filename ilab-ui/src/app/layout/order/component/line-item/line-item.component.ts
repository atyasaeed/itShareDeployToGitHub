import { Component, OnInit, Input, Inject } from '@angular/core';
import { LineItem, ShoppingCartItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {
  @Input() lineItem: LineItem;
  @Input() status: string;

  constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig) {}

  ngOnInit() {
    //console.log(this.lineItem);
    //console.log(this.status);
  }
  ngAfterViewInit() {
    //console.log(this.status);
  }
  getImageUrl(): string {
    return this.appConfig.ASSETS_URL + this.lineItem.service.id;
  }

  getFileUrl(index): string {
    return this.appConfig.FILE_URL + this.lineItem.files[index].asset_id;
  }

  getFileExtension() {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = this.lineItem.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return this.appConfig.FILE_URL + this.lineItem.files[0].asset_id;
    } else {
      return false;
    }
  }

  checkStatus() {
    let result = '';

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
}
