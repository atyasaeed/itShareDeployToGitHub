import { ShoppingCartComponent } from './shopping-cart.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartFormComponent } from './shopping-cart-form/shopping-cart-form.component';

const routes: Routes = [
  { path: '', component: ShoppingCartComponent },
  { path: 'CartItem', component: ShoppingCartFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartRoutingModule {}
