//import { OrderItem } from './order-item.model';
import { Entity } from './entity';
import { Reason } from './reason.model';
import { LineItem } from './line-item.model';
import { User } from './user.model';
import { Address } from './address.model';

export interface Order extends Entity {
  id: string;
  date: Date;
  totalCost: number;
  status: string;
  lineItems: LineItem[];
  rejectionReasons: Reason[];
  rejectionNote: string;
  quotedAt: Date;
  expiredAt: Date;
  duration: number;
  placedBy?: User;
  shippingAddress: Address;
}
