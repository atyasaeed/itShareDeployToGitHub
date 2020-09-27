import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';

const routes: Routes = [
  { path: '', component: OrganizationInfoComponent },
  { path: 'create', component: OrganizationInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationInfoRoutingModule {}
