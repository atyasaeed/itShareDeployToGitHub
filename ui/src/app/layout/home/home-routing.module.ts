import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerGuard } from 'src/app/shared/guard/partner.guard';
import { HomeComponent } from './home.component';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'partner', component: OwnerLandingPageComponent, canActivate: [PartnerGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
