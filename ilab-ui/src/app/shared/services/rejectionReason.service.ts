import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Reason } from '../domain/reason.model';
import { CdkObserveContent } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root',
})
export class RejectionReasonService extends RestService<Reason> {
  resource = 'reason';
}
