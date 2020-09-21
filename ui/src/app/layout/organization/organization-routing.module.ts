import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationFormComponent } from './organization-form/organization-form.component';

const routes: Routes = [
  { path: '', component: OrganizationFormComponent },
  { path: 'create', component: OrganizationFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
