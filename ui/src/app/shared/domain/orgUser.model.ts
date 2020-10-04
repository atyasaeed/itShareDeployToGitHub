import { Entity } from './entity';
import { Organization } from './organization.model';
import { User } from './user.model';

export interface OrgUser extends Entity {
  user: User;
  placedBy: User;
  org: Organization;
  role: string;
}
