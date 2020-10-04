import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Organization } from '../domain/organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrgUserService extends RestService<Organization> {
  resource = 'org-user';
}
