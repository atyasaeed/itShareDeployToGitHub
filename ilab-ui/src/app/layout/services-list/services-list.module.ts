import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesListComponent } from './services-list.component';
import { ServicesListRoutingModule } from './services-list-routing.module';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepsModule } from 'src/app/shared/modules/steps/steps.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';

@NgModule({
  declarations: [ServicesListComponent, ServiceFormComponent],
  imports: [CommonModule, NgbModule, ServicesListRoutingModule, ReactiveFormsModule, StepsModule, TranslateModule],
})
export class ServicesListModule {}
