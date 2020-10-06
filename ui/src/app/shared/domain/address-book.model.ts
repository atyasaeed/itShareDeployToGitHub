import { State } from './state.model';
import { Entity } from './entity';
import { City } from './city.model';

export interface AddressBook extends Entity {
  state: State;
  city: City;
  lineOne: string;
  lineTwo: string;
  phoneNumber: number;
}
