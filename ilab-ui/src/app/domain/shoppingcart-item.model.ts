import { Service } from './service.model';

export class ShoppingCartItem {
  id:string;
  deliveryDate: Date ;
  color: string;
  projectType: string;
  material: string ;
  unit: string ;
  file: File ;
  service:Service;
  quantity:number = 1;
  price:number = 180;
}
