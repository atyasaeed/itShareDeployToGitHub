import { Component, OnInit, Input, Inject } from '@angular/core';
import { LineItem } from 'src/app/shared/domain';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {
  @Input() lineItem: LineItem;

  constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig) {}

  ngOnInit() {}
  getImageUrl(): string {
    return this.appConfig.ASSETS_URL + this.lineItem.service.id;
  }

  getFileUrl(index): string {
    return this.appConfig.FILE_URL + this.lineItem.files[index].asset_id;
  }
}
