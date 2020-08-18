import { Entity } from './entity';

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
