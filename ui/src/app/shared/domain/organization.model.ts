import { Entity } from './entity';
import { Service } from './service.model';

export interface Organization extends Entity {
  name: string;
  website: string;
  mobileNo: number;
  city: string;
  address: string;
  services: Service[];
}
