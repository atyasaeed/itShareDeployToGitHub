import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './user-form/user-form.component';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { LinkableModule } from '../linkable/linkable.module';
import { OrganizationInfoModule } from 'src/app/shared/modules/organization-info/organization-info.module';
import { UserInfoModule } from 'src/app/shared/modules/user-info/user-info.module';
import { ImportUsersComponent } from './import-users/import-users.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [UsersComponent, UserFormComponent, ImportUsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    LinkableModule,
    OrganizationInfoModule,
    UserInfoModule,
    MatTabsModule,
    TranslateModule,
    NgbModule,
    SharedModule,
    PageHeaderModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ModalModule.forRoot(),
  ],
})
export class UsersModule {}
