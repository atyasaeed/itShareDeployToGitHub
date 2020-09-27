import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceCardComponent } from './service-card/service-card.component';
//import { MatCardModule } from '@angular/material/card';
//import { StatModule } from 'src/app/shared/modules/stat/stat.module';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { OwnerLandingPageComponent } from './owner-landing-page/owner-landing-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [HomeComponent, ServiceCardComponent, OwnerLandingPageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    //FormsModule,
    //ReactiveFormsModule,
    NgbModule,
    //StatModule,
    TranslateModule,
    CovalentLoadingModule,
    MatStepperModule,
    PageHeaderModule,
    MatButtonModule,
  ],
})
export class HomeModule {}
