import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineItemComponent } from './components/line-item/line-item.component';
import { OrderComponent } from './order.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'line-item', component: LineItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
