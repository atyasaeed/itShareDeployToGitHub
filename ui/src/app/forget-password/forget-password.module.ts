import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password.component';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CovalentLoadingModule } from '@covalent/core/loading';

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    ForgetPasswordRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CovalentLoadingModule,
  ],
})
export class ForgetPasswordModule {}
