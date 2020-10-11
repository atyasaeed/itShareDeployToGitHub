import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitiesComponent } from './cities.component';
import { CityFormComponent } from './city-form/city-form.component';

const routes: Routes = [
  { path: '', component: CitiesComponent },
  { path: 'create', component: CityFormComponent },
  { path: ':entityId', component: CityFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitiesRoutingModule {}
