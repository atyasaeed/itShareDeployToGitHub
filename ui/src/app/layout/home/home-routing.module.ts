import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotActivePartnerGuard } from 'src/app/shared/guard/not-active-partner.guard';
import { PartnerGuard } from 'src/app/shared/guard/partner.guard';
import { HomeComponent } from './home.component';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'partner', component: OwnerLandingPageComponent, canActivate: [NotActivePartnerGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
