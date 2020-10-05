import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Organization } from '../domain/organization.model';
import { OrgUser } from '../domain/orgUser.model';

@Injectable({
  providedIn: 'root',
})
export class OrgUserService extends RestService<OrgUser> {
  resource = 'orguser';

  inviteUser(email) {
    return this.http.post(this.appConfig.getResourceUrl(this.resource), email);
  }

  getInvitationPlacedBy(id) {
    return this.http.get<OrgUser>(this.appConfig.getResourceUrl(this.resource) + '/' + id);
  }

  memberAcceptInvitation(id) {
    return this.http.put<OrgUser>(this.appConfig.getResourceUrl(this.resource) + '/accept/' + id, null);
  }

  memberDeclineInvitation(id) {
    return this.http.delete(this.appConfig.getResourceUrl(this.resource) + '/' + id);
  }
}
