import { Entity } from './entity';
import { AssetFile, LineItem } from './line-item.model';
import { Organization } from './organization.model';
import { Service } from './service.model';
import { User } from './user.model';

export interface Quotation extends Entity {
  lineItem: LineItem;
  placedBy: User;
  partner: Organization;
  unitPrice?: number;
  duration?: number;
  endDate: Date
  status :string
}
