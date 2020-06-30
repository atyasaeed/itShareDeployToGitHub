import { Service } from './service.model';
import { Entity } from './entity';

export interface LineItem extends Entity {
  id: string;
  rank: number;
  quantity: number;
  attend: boolean;
  unitPrice: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  estimatedStardDate: Date;
  estimatedEndDate: Date;
  notes?: string;
  service: Service;
  files: hyperFile[];
  asset_id: string;
  asset_name: string;
}
export class hyperFile {
  materials: string;
  width: number;
  height: number;
  thickness?: string;
  type?: string;
  color?: string;
  processes: string[];
  //dimension: string;
  //asset_id: string;
  //asset_name: string;
}
