import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule } from 'ngx-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CovalentLoadingModule } from '@covalent/core/loading';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CovalentLoadingModule,
    AlertModule.forRoot(),
  ],
})
export class LoginModule {}
