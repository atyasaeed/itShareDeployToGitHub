import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Reason } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ReasonsService extends RestService<Reason> {
  resource = 'reason';
}
