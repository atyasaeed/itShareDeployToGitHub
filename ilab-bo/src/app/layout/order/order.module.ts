import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { LineItemComponent } from './components/line-item/line-item.component';

@NgModule({
  declarations: [OrderComponent, OrderCardComponent, LineItemComponent],
  imports: [CommonModule, OrderRoutingModule],
})
export class OrderModule {}
