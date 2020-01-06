import { LineItem } from './line-item.model';

export class ShoppingCartItem extends LineItem{
  constructor(){
    super();
    this.price=180;
    this.quantity=1;
  }
}
