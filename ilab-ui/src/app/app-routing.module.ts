import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CartComponent } from './components/cart/cart.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { ServiceComponent } from './components/service/service.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';


const routes: Routes = [
  {path:'' , component:LandingpageComponent},
  {path:'login',component:LoginComponent},
  {path:'registration',component:RegistrationComponent},
  {path:'signup',component:RegistrationComponent},
  {path:'cart',component:CartComponent},
  {path:'orders',component:TrackOrderComponent},
  {path:'service',component:ServiceComponent},
  {path:'change-password',component:ChangePasswordComponent},
  {path:'forget-password',component:ForgetPasswordComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
