import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOrganizationsRoutingModule } from './my-organizations-routing.module';
import { MyOrganizationsComponent } from './my-organizations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyOrganizationsComponent],
  imports: [
    CommonModule,
    MyOrganizationsRoutingModule,
    NgbModule,
    PageHeaderModule,
    TranslateModule,
    CovalentLoadingModule,
    FormsModule,
  ],
})
export class MyOrganizationsModule {}
