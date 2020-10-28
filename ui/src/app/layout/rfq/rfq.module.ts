import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfqRoutingModule } from './rfq-routing.module';
import { RfqComponent } from './rfq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { StlModalModule } from 'src/app/shared/modules/stl-modal/stl-modal.module';

@NgModule({
  declarations: [RfqComponent],
  imports: [
    CommonModule,
    RfqRoutingModule,
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
export class RfqModule {}
