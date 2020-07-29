import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './my-orders-routing.module';
import { OrderComponent } from './my-orders.component';
import { OrderCardComponent } from './my-order-card/my-order-card.component';
import { LineItemComponent } from './line-item/line-item.component';
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
import { ModalModule } from 'ngx-bootstrap/modal';
import { CovalentLoadingModule } from '@covalent/core/loading';

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
    ModalModule.forRoot(),
    CovalentLoadingModule,
  ],
})
export class OrderModule {}
