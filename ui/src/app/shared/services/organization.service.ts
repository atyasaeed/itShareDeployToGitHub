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
}
