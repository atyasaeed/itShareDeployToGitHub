import { OrderItem } from './order-item.model';

export class Order{
  id: number;
  date: Date;
  total_payment: number;
  status: string;
  lineItems : OrderItem[];
}
