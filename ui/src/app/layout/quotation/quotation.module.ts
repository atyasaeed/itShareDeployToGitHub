import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationComponent } from './quotation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { StlModalModule } from 'src/app/shared/modules/stl-modal/stl-modal.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    SharedModule,
    PageHeaderModule,
    StlModalModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    TooltipModule,
    MatTabsModule,
  ],
})
export class QuotationModule {}
