import { Entity } from './entity';
import { City } from './city.model';

export interface Address extends Entity {
  name: string;
  city: City;
  lineOne: string;
  lineTwo: string;
  contactName: string;
  phoneNo: number;
}
