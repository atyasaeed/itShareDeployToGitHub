import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesListComponent } from './services-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';

const routes: Routes = [
  { path: '', component: ServicesListComponent },
  { path: 'service-form', component: ServiceFormComponent },
  { path: ':entityId', component: ServiceFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesListRoutingModule {}
