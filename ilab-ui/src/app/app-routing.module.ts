
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CartComponent } from './components/cart/cart.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { AuthGuard } from 'src/app/services/auth-guard.guard';
import { NonAuthGuard } from './services/non-auth.guard';




const routes: Routes = [
  {path: '' , component: LandingpageComponent},
  {path: 'Landingpage' , component: LandingpageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent, canActivate: [NonAuthGuard]},
  // {path:'signup',component:RegistrationComponent,canActivate:[AuthGuard]},
  {path: 'cart', component: CartComponent,canActivate: [AuthGuard]},
  {path: 'orders', component: TrackOrderComponent, canActivate: [AuthGuard]},
  {path: 'CartItem', component: CartItemComponent,canActivate: [AuthGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'forget-password', component: ForgetPasswordComponent, canActivate: [NonAuthGuard]},
  {path: 'reset-password', component: ResetPasswordComponent,canActivate: [NonAuthGuard] },

  {path: '**' , component: LandingpageComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
