import { Service } from './service.model';

export class LineItem{
  id:string;
  deliveryDate: Date ;
  color: string;
  projectType: string;
  material: string ;
  unit: string ;
  file: File ;
  service:Service;
  quantity:number;
  price:number;
}
