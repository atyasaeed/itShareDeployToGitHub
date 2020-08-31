import { Service } from './service.model';
import { Entity } from './entity';
import { Reason } from './reason.model';

export interface LineItem extends Entity {
  id: string;
  rank: number;
  quantity: number;
  attend: boolean;
  unitPrice?: number;
  duration?: number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  estimatedStartDate: Date;
  notes?: string;
  service: Service;
  files: hyperFile[];
  asset_id: string;
  asset_name: string;
  status: string;
  rejectionReasons: Reason[];
  rejectionNote: string;
}
export class hyperFile {
  material: string;
  width: number;
  height: number;
  thickness?: string;
  type?: string;
  color?: string;
  unit?: string;
  processes?: string[];
  //dimension: string;
  asset_id: string;
  asset_name: string;
}
export class AssetFile {
  id: string;
  name: string;
  created?: Date | string;
}
