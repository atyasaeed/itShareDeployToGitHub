import { Entity } from './entity';

export interface Reason extends Entity {
  name: string;
  status: string;
}
