import { OrderItem } from './order-item.model';
import { Entity } from './entity';

export interface Order extends Entity {
  id: string;
  date: Date;
  totalCost: number;
  status: string;
  lineItems: OrderItem[];
}
