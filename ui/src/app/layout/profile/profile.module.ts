import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OrganizationInfoModule } from 'src/app/shared/modules/organization-info/organization-info.module';
import { UserInfoModule } from 'src/app/shared/modules/user-info/user-info.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NgbModule,

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
    UserInfoModule,
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
  ],
})
export class ProfileModule {}
