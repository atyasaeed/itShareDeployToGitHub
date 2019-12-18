import {Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CartComponent } from './components/cart/cart.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';

export const routes: Routes = [
  {path: '' , component : HomeComponent},
  {path: 'home', component : HomeComponent},
  {path: 'login' , component : LogInComponent},
  {path: 'signup' , component: SignUpComponent},
  {path : 'cart' , component: CartComponent},
  {path : 'trackorder', component: TrackOrderComponent},
  {path : '**' , component : HomeComponent},

]
