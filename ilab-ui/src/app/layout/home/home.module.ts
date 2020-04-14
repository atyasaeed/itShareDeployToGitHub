import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceCardComponent } from './service-card/service-card.component';

@NgModule({
  declarations: [HomeComponent, ServiceCardComponent],
  imports: [CommonModule, HomeRoutingModule, CarouselModule, FormsModule, ReactiveFormsModule, NgbModule],
})
export class HomeModule {}
