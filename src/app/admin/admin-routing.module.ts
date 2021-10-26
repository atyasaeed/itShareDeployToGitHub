import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductsComponent } from './admin-products/admin-products.component';

const routes: Routes = [
  {
    path: 'admin', children: [
      { path: '', component: AdminOrdersComponent },
      { path: 'products', component: AdminProductsComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class AdminRoutingModule { }
