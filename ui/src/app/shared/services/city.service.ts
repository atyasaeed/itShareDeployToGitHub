import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { City } from '../domain/city.model';

@Injectable({
  providedIn: 'root',
})
export class CityService extends RestService<City> {
  resource = 'city';

  getCitiesOfState(stateId: number) {
    return this.http.get(this.appConfig.getResourceUrl(this.resource) + "/search?search=state.id:'" + stateId + "'");
  }
}
