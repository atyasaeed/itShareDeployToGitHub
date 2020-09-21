import { City } from 'src/app/signup/signup-partner/city';
import { Entity } from './entity';
import { AssetFile } from './line-item.model';
import { Service } from './service.model';

export interface User extends Entity {
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNo: number;
  email: string;
  username: string;
  password: string;
  enabled: boolean;
  roles: string[];
  status: boolean;
}
export interface Organization extends Entity {
  name: string;
  mobileNo: string;
  city: City;
  address: string;
  website: string;
  services: Service[];
  status: string;
}
