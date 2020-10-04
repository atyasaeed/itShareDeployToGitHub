import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationTeamComponent } from './organization-team.component';

const routes: Routes = [{ path: '', component: OrganizationTeamComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationTeamRoutingModule {}
