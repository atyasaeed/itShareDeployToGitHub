import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRequestsRoutingModule } from './quotation-requests-routing.module';
import { QuotationRequestsComponent } from './quotation-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { StlModalModule } from 'src/app/shared/modules/stl-modal/stl-modal.module';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [QuotationRequestsComponent],
  imports: [
    CommonModule,
    QuotationRequestsRoutingModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    SharedModule,
    PageHeaderModule,
    StlModalModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    TooltipModule,
  ],
})
export class QuotationRequestsModule {}
