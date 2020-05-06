import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

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
@NgModule({
  declarations: [UsersComponent, UserFormComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    FormsModule,
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
  ],
})
export class UsersModule {}
