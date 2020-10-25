import { Entity } from './entity';
import { LineItem } from './line-item.model';
import { User } from './user.model';

export interface Quotation extends Entity {
  requestedBY: User;
  lineItem: LineItem;
  duration: number;
  price: number;
  expirationDuration: number;
  status: string;
}
