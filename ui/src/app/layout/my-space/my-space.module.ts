import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySpaceRoutingModule } from './my-space-routing.module';
import { MySpaceComponent } from './my-space.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CovalentLoadingModule } from '@covalent/core/loading';
@NgModule({
  declarations: [MySpaceComponent],

  imports: [
    CommonModule,
    MySpaceRoutingModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    SharedModule,
    PageHeaderModule,
    ModalModule.forRoot(),
    CovalentLoadingModule,
  ],
})
export class MySpaceModule {}