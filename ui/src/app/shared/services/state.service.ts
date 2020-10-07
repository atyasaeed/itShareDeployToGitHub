import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { State } from '../domain/state.model';

@Injectable({
  providedIn: 'root',
})
export class StateService extends RestService<State> {
  resource = 'state';

  // getAllStates() {
  //   return this.http.get<State[]>(this.appConfig.getResourceUrl(this.resource) + '/search');
  // }
}
