import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'activation', component: SignupActivationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRoutingModule {}
