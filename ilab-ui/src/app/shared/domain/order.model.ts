import { OrderItem } from './order-item.model';
import { Entity } from './entity';

export interface Order extends Entity {
  id: string;
  date: Date;
  total_payment: number;
  status: string;
  lineItems: OrderItem[];
}
