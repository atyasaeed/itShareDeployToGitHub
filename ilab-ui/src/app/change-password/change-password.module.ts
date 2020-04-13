import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [CommonModule, ChangePasswordRoutingModule, TranslateModule, ReactiveFormsModule, SharedModule],
})
export class ChangePasswordModule {}
