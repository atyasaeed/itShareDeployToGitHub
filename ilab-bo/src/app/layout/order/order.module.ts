import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LineItemComponent } from './components/line-item/line-item.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [OrderComponent, OrderCardComponent, LineItemComponent],
  imports: [CommonModule, OrderRoutingModule, FormsModule],
})
export class OrderModule {}
