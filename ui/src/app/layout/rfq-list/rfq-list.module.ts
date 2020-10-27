import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfqListRoutingModule } from './rfq-list-routing.module';
import { RfqListComponent } from './rfq-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [RfqListComponent],
  imports: [
    CommonModule,
    RfqListRoutingModule,
    NgbModule,
    TranslateModule,
    PageHeaderModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
})
export class RfqListModule {}
