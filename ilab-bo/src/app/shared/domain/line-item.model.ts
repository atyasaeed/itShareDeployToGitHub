import { Service } from './service.model';

export class LineItem {
  id: string;
  rank: number;
  quantity: number;
  attend: boolean;
  unitPrice:number;
  plannedStartDate: Date;
  plannedEndDate: Date;
  estimatedStardDate:Date;
  estimatedEndDate:Date
  notes: string;
  service: Service;
  files: FileMaterial[];
  asset_id: string;
  asset_name: string;
}
export class FileMaterial {
  material:string;
  type:string;
  color:string;
  dimension:string;
  asset_id:string;
  asset_name:string;
}
