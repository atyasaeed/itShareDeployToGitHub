import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OrdersListRoutingModule } from './orders-list-routing.module';
import { OrdersListComponent } from './orders-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OrdersFormComponent } from './orders-form/orders-form.component';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ng2-tooltip-directive';
import { StlModalModule } from 'src/app/shared/modules/stl-modal/stl-modal.module';

@NgModule({
  declarations: [OrdersListComponent, OrdersFormComponent],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    OrdersListRoutingModule,
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
    StlModalModule,
    TooltipModule,
    ModalModule.forRoot(),
  ],
})
export class OrdersListModule {}
