import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from './shopping-cart.component';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartFormComponent } from './shopping-cart-form/shopping-cart-form.component';

@NgModule({
  declarations: [ShoppingCartComponent, ShoppingCartFormComponent],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
  ],
})
export class ShoppingCartModule {}
