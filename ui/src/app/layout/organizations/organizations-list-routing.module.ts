import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationFormComponent } from './organization-form/organization-form.component';
import { OrganizationsListComponent } from './organizations-list.component';

const routes: Routes = [
  { path: '', component: OrganizationsListComponent },
  { path: 'create', component: OrganizationFormComponent },
  { path: ':entityId', component: OrganizationFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsListRoutingModule {}
