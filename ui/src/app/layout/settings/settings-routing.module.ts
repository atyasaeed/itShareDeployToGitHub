import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'prefix' },
      {
        path: 'governorate',
        loadChildren: () => import('./states/states.module').then((m) => m.StatesModule),
      },
      {
        path: 'city',
        loadChildren: () => import('./cities/cities.module').then((m) => m.CitiesModule),
      },
      {
        path: 'rfq',
        loadChildren: () => import('./rfq/rfq.module').then((m) => m.RfqModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
