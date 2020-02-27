import { Service } from './service.model';

export class LineItem {
  id: string;
  rank: number;
  quantity: number;
  attend: boolean;
  startingDate: Date;
  deliveryDate: Date;
  notes: string;
  unitPrice: number;
  service: Service;
  asset_id: string;
  asset_name: string;
  files: FileMaterial[];
}
export class FileMaterial {
  file: File;
  material: string;
  type: string;
  color: string;
  dimension: string;
  unit: string;
}
