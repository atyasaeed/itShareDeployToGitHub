import { Entity } from './entity';
import { AssetFile } from './line-item.model';
import { Service } from './service.model';

export interface Organization extends Entity {
  name: string;
  mobileNo: number;
  city: string;
  type: string;
  address: string;
  website: string;
  services: Service[];
  status: string;
  statusReason: string;
  comReg: AssetFile;
  taxId: AssetFile;
  backNatId: AssetFile;
  frontNatId: AssetFile;
  owner: Owner;
}

export interface Owner extends Entity {
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNo: string;
  enabled: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  roles: string[];
}

export interface City {
  id: string;
  arName: string;
  enName: string;
}
