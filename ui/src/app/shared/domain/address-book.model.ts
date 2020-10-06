import { Entity } from './entity';

export interface AddressBook extends Entity {
  state: string;
  city: string;
  lineOne: string;
  lineTwo: string;
  phoneNumber: number;
}
