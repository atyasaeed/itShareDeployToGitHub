import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
      { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
      { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'machines', loadChildren: () => import('./machines/machines.module').then(m => m.MachinesModule) },
      { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
