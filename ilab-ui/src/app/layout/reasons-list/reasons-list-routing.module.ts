import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReasonsListComponent } from './reasons-list.component';
import { ReasonsFormComponent } from './reasons-form/reasons-form.component';

const routes: Routes = [
  { path: '', component: ReasonsListComponent },
  { path: 'reason-form', component: ReasonsFormComponent },
  { path: ':entityId', component: ReasonsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReasonsListRoutingModule {}
