import { Entity } from './entity';

export interface User extends Entity {
  arName: string;
  enName: string;
  phoneNo: number;
  email: string;
  username: string;
  password: string;
  roles: string[];
}
