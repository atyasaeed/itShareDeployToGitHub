import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { SignupActivationComponent } from './signup-activation/signup-activation.component';
import { SignupPartnerComponent } from './signup-partner/signup-partner.component';
import { userPrivilege } from '../shared/guard/user-privilege.guard';
import { NonAuthGuard } from '../shared/guard/non-auth.guard';
import { AuthGuard } from '../shared/guard';
import { CanDeactivateGuard } from '../shared/guard/can-deactivate-guard.service';

const routes: Routes = [
  //{ path: '/:type', component: SignupComponent },
  { path: '', component: SignupComponent, canDeactivate: [CanDeactivateGuard] },

  { path: 'activation', component: SignupActivationComponent },
  {
    path: 'partner',
    component: SignupPartnerComponent,
    canActivate: [userPrivilege],
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRoutingModule {}
