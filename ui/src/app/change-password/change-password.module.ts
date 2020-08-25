import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { CovalentLoadingModule } from '@covalent/core/loading';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    CovalentLoadingModule,
  ],
})
export class ChangePasswordModule {}
