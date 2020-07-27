import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { RejectionReason } from '../domain/reason.model';
import { CdkObserveContent } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root',
})
export class RejectionReasonService extends RestService<RejectionReason> {
  resource = 'reason';

  getReasons() {
    return this.http.get(this.appConfig.getResourceUrl(this.resource) + '/search');
  }
}
