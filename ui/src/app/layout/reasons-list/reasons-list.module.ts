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
  ],
})
export class ReasonsListModule {}
