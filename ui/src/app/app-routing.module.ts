import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonAuthGuard } from './shared/guard/non-auth.guard';
import { AuthGuard } from './shared/guard';
import { CustomPreloadingStrategy } from './shared/services/custom-preloading-strategy.service';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule) },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
    data: { preload: true },
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then((m) => m.ForgetPasswordModule),
    canActivate: [NonAuthGuard],
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then((m) => m.ChangePasswordModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./access-denied/access-denied.module').then((m) => m.AccessDeniedModule),
  },
  { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then((m) => m.NotFoundModule) },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
