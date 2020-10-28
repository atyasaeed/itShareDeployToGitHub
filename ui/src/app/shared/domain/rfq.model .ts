import { Service } from './service.model';
import { Entity } from './entity';
import { hyperFile } from './line-item.model';

export interface RFQ extends Entity {
  id: string;
  quantity: number;
  service: Service;
  files: hyperFile[];
  status: string;
  unitPrice?: number;
  duration?: number;
}

