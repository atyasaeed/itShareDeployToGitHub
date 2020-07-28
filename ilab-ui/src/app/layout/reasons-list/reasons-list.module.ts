import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReasonsListRoutingModule } from './reasons-list-routing.module';
import { ReasonsListComponent } from './reasons-list.component';
import { ReasonsFormComponent } from './reasons-form/reasons-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepsModule } from 'src/app/shared/modules/steps/steps.module';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ReasonsListComponent, ReasonsFormComponent],
  imports: [
    CommonModule,
    NgbModule,
    ReasonsListRoutingModule,
    ReactiveFormsModule,
    StepsModule,
    TranslateModule,
    PageHeaderModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    FormsModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class ReasonsListModule {}
