import { Entity } from './entity';
import { LineItem } from './line-item.model';
import { Organization } from './organization.model';
import { User } from './user.model';

export interface Quotation extends Entity {
  lineItem: LineItem;
  placedBy: User;
  partner: Organization;
  unitPrice: number;
  duration: number;
  status: string;
  endDate: string;
}
