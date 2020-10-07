import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StateFormComponent } from './state-form/state-form.component';
import { StatesComponent } from './states.component';

const routes: Routes = [
  { path: '', component: StatesComponent },
  { path: 'create', component: StateFormComponent },
  { path: ':entityId', component: StateFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatesRoutingModule {}
