import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestService } from 'src/app/shared/services';
import { ShoppingCartItem, Order, Organization } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends RestService<Organization> {
  resource = 'organization';
  updateOrg(formDate: FormData, id) {
    return this.http.put(this.url + '/' + id, formDate);
  }
}
