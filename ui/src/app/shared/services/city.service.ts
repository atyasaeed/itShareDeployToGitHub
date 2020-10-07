import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { City } from '../domain/city.model';
import { State } from '../domain/state.model';

@Injectable({
  providedIn: 'root',
})
export class CityService extends RestService<City> {
  resource: string = 'assets/state';
}
