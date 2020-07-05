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

  constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig) {}

  ngOnInit() {}
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
}
