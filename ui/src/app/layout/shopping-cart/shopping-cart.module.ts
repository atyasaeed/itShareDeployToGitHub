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
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatRadioModule } from '@angular/material/radio';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ng2-tooltip-directive';
import { StlModalModule } from 'src/app/shared/modules/stl-modal/stl-modal.module';
@NgModule({
  declarations: [ShoppingCartComponent, ShoppingCartFormComponent],
  imports: [
    CommonModule,
    StlModalModule,
    NgMultiSelectDropDownModule.forRoot(),
    ShoppingCartRoutingModule,
    NgbModule,
    SharedModule,
    PageHeaderModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    MatRadioModule,
    TooltipModule,
    ModalModule.forRoot(),
  ],
})
export class ShoppingCartModule {}
