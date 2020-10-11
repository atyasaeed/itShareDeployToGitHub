import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitiesRoutingModule } from './cities-routing.module';
import { CitiesComponent } from './cities.component';
import { CityFormComponent } from './city-form/city-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';

@NgModule({
  declarations: [CitiesComponent, CityFormComponent],
  imports: [
    CommonModule,
    CitiesRoutingModule,
    PageHeaderModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    NgbModule,
    SharedModule,
  ],
})
export class CitiesModule {}
