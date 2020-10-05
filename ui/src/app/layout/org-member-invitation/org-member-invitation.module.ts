import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgMemberInvitationRoutingModule } from './org-member-invitation-routing.module';
import { OrgMemberInvitationComponent } from './org-member-invitation.component';
import { TranslateModule } from '@ngx-translate/core';
import { CovalentLoadingModule } from '@covalent/core/loading';

@NgModule({
  declarations: [OrgMemberInvitationComponent],
  imports: [CommonModule, OrgMemberInvitationRoutingModule, TranslateModule, CovalentLoadingModule],
})
export class OrgMemberInvitationModule {}
