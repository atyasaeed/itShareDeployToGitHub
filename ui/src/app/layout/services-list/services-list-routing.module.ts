import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesListComponent } from './services-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { CanDeactivateGuard } from 'src/app/shared/guard/can-deactivate-guard.service';

const routes: Routes = [
  { path: '', component: ServicesListComponent },
  { path: 'service-form', component: ServiceFormComponent, canDeactivate: [CanDeactivateGuard] },
  { path: ':entityId', component: ServiceFormComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesListRoutingModule {}
