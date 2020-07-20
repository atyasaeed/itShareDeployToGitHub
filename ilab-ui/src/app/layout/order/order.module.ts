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
import { StepsModule } from 'src/app/shared/modules/steps/steps.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPrintModule } from 'ngx-print';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [OrderComponent, OrderCardComponent, LineItemComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    OrderRoutingModule,
    NgbModule,
    FormsModule,
    PageHeaderModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    StepsModule,
    NgxPrintModule,
    StlModelViewerModule,
    TooltipModule,
  ],
})
export class OrderModule {}
