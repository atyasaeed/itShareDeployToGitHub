import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';
import { SignupPartnerComponent } from './signup-partner/signup-partner.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'activation', component: SignupActivationComponent },
  { path: 'partner', component: SignupPartnerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRoutingModule {}
