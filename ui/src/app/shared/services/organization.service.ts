import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Organization } from '../domain/organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends RestService<Organization> {
  resource = 'organization';
  updateOrg(formDate: FormData, id) {
    return this.http.put(this.url + '/' + id, formDate);
  }
  updateAdminOrg(org, id) {
    return this.http.put(this.url + '/' + id + '/admin', org);
  }
  requestApproval(org: Organization) {
    return this.http.put(this.url + '/' + org.id + '/requestApproval', '');
  }
  getOrgAdmin(id) {
    return this.http.get(this.url + '/admin' + '/' + id  )
  }
}
