import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgMemberInvitationComponent } from './org-member-invitation.component';

const routes: Routes = [{ path: '', component: OrgMemberInvitationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgMemberInvitationRoutingModule {}
