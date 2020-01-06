import { LineItem } from './line-item.model';

export class Order{
  id: number;
  date: Date;
  total_payment: number;
  status: string;
  lineItems : LineItem[];
}
