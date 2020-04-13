import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, ResetPasswordRoutingModule, TranslateModule, ReactiveFormsModule, SharedModule],
})
export class ResetPasswordModule {}
