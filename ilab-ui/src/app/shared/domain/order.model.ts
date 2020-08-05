import { OrderItem } from './order-item.model';
import { Entity } from './entity';
import { Reason } from './reason.model';

export interface Order extends Entity {
  id: string;
  date: Date;
  totalCost: number;
  status: string;
  lineItems: OrderItem[];
  rejectionReasons: Reason[];
  rejectionNote: string;
  quotedAt: Date;
  expiredAt: Date;
}
