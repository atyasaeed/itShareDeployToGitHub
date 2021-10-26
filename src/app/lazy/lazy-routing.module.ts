import { AdminProductsComponent } from './../admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './../admin/admin-orders/admin-orders.component';
import { LazyComponent } from './lazy/lazy.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', component: LazyComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/products', component: AdminProductsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyRoutingModule { }
