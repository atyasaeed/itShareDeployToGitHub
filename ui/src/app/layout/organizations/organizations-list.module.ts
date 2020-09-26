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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OrganizationFormComponent } from './organization-form/organization-form.component';
import { OrganizationInfoModule } from 'src/app/shared/modules/organization-info/organization-info.module';

@NgModule({
  declarations: [OrganizationsListComponent, OrganizationFormComponent],
  imports: [
    CommonModule,
    OrganizationsListRoutingModule,
    NgbModule,
    MatTabsModule,

    FormsModule,
    SharedModule,
    PageHeaderModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    SharedModule,
    PageHeaderModule,
    MatTabsModule,
    OrganizationInfoModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    MatIconModule,
    // MatButtonModule,
    MatSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class OrganizationsListModule {}
