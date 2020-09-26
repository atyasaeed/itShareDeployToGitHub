import { Entity } from './entity';
import { Organization } from './organization.model';

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
  defaultOrg: Organization;
}
