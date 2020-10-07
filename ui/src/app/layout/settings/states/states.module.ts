import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatesRoutingModule } from './states-routing.module';
import { StatesComponent } from './states.component';
import { StateFormComponent } from './state-form/state-form.component';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [StatesComponent, StateFormComponent],
  imports: [
    CommonModule,
    StatesRoutingModule,
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
export class StatesModule {}
