import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AdminGuard, AuthGuard } from '../shared/guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'prefix' },
      { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then((m) => m.ChartsModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [AdminGuard],
      },

      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'shopping-cart',
        loadChildren: () => import('./shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then((m) => m.OrderModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'orders-list',
        loadChildren: () => import('./orders-list/orders-list.module').then((m) => m.OrdersListModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then((m) => m.GalleryModule),
      },
      {
        path: 'space',
        loadChildren: () => import('./my-space/my-space.module').then((m) => m.MySpaceModule),
      },
      {
        path: 'services-list',
        loadChildren: () => import('./services-list/services-list.module').then((m) => m.ServicesListModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
