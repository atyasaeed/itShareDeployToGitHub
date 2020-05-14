import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderCardComponent } from './component/order-card/order-card.component';
import { LineItemComponent } from './component/line-item/line-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';

@NgModule({
  declarations: [OrderComponent, OrderCardComponent, LineItemComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    FormsModule,
    PageHeaderModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
})
export class OrderModule {}
