import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationTeamRoutingModule } from './organization-team-routing.module';
import { OrganizationTeamComponent } from './organization-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';

@NgModule({
  declarations: [OrganizationTeamComponent],
  imports: [
    CommonModule,
    OrganizationTeamRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CovalentDialogsModule,
    PageHeaderModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    CovalentLoadingModule,
  ],
})
export class OrganizationTeamModule {}
