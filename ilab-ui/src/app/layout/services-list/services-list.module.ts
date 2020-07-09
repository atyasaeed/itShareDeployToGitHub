import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesListComponent } from './services-list.component';
import { ServicesListRoutingModule } from './services-list-routing.module';
import { ServiceFormComponent } from './service-form/service-form.component';

@NgModule({
  declarations: [ServicesListComponent, ServiceFormComponent],
  imports: [CommonModule, ServicesListRoutingModule],
})
export class ServicesListModule {}
