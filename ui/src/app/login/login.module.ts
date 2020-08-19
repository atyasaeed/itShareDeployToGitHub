import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule } from 'ngx-bootstrap';
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, TranslateModule, LoginRoutingModule, ReactiveFormsModule, AlertModule.forRoot()],
})
export class LoginModule {}
