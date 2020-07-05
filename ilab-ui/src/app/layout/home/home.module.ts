import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceCardComponent } from './service-card/service-card.component';
import { MatCardModule } from '@angular/material/card';
import { StatModule } from 'src/app/shared/modules/stat/stat.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomeComponent, ServiceCardComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    StatModule,
    TranslateModule,
  ],
})
export class HomeModule {}
