import { Entity } from './entity';

export interface User extends Entity {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNo: number;
  email: string;
  username: string;
  password: string;
  enabled: boolean;
  roles: string[];
}
