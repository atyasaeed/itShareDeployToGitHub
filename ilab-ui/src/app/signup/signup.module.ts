import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';

@NgModule({
  declarations: [SignupComponent, SignupActivationComponent],
  imports: [CommonModule, SignupRoutingModule, TranslateModule, ReactiveFormsModule, SharedModule],
})
export class SignupModule {}
