import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from './shopping-cart.component';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartFormComponent } from './shopping-cart-form/shopping-cart-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { MatRadioModule } from '@angular/material/radio';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [ShoppingCartComponent, ShoppingCartFormComponent],
  imports: [
    CommonModule,
    StlModelViewerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ShoppingCartRoutingModule,
    NgbModule,
    //FormsModule,
    //ReactiveFormsModule,
    SharedModule,
    PageHeaderModule,
    TranslateModule,
    //MatCardModule,
    //MatFormFieldModule,
    //MatInputModule,
    //CovalentLoadingModule,
    //CovalentDialogsModule,
    //MatIconModule,
    //MatButtonModule,
    //MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    //MatInputModule,
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
    MatRadioModule,
    MatInputModule,
    TooltipModule,
    ModalModule.forRoot(),
  ],
})
export class ShoppingCartModule {}
