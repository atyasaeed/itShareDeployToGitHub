import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrganizationsComponent } from './my-organizations.component';

const routes: Routes = [{ path: '', component: MyOrganizationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyOrganizationsRoutingModule {}
