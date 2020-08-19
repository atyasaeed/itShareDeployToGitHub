import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersListComponent } from './orders-list.component';
import { OrdersFormComponent } from './orders-form/orders-form.component';

const routes: Routes = [
  { path: '', component: OrdersListComponent },
  { path: 'order-form', component: OrdersFormComponent },
  { path: ':entityId', component: OrdersFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersListRoutingModule {}
