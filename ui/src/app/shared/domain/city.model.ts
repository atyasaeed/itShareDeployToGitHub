import { Entity } from './entity';
import { State } from './state.model';

export interface City extends Entity {
  arName: string;
  enName: string;
  state: State;
}
