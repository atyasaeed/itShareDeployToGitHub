import { Entity } from './entity';
import { AssetFile } from './line-item.model';
import { Service } from './service.model';
import { User } from './user.model';

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
  owner: User;
}
