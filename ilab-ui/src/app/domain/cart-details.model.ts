import { Service } from './service.model';

export class CartDetails {
  id:number;
  deliveryDate: Date ;
  color: string;
  typeProject: string;
  material: string ;
  unit: string ;
  file: File ;
  service:Service;
  quantity:number = 1;
  price:string = "$180";
  index:number;
}
