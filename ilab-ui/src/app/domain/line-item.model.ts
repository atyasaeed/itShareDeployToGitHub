import { Service } from './service.model';

export class LineItem{
  id:string;
  rank:number;
  quantity:number;
  unitPrice:number;
  color: string;
  projectType: string;
  material: string ;
  unit: string ;
  plannedStartDate: Date ;
  service:Service;
  asset_id:string;
  asset_name:string;
  file: File ;




}
