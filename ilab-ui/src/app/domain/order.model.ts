import { OrderItem } from './order-item.model';

export class Order{
  id: string;
  date: Date;
  total_payment: number;
  status: string;
  lineItems : OrderItem[];
}
