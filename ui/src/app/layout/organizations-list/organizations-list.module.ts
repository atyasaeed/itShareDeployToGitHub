import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsListRoutingModule } from './organizations-list-routing.module';
import { OrganizationsListComponent } from './organizations-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [OrganizationsListComponent],
  imports: [
    CommonModule,
    OrganizationsListRoutingModule,
    NgbModule,
    TranslateModule,
    PageHeaderModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    SharedModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class OrganizationsListModule {}
