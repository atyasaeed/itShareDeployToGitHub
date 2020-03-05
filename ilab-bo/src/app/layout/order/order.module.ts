import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LineItemComponent } from './components/line-item/line-item.component';
import { NgbdmodalmachineComponent } from './components/ngbdmodalmachine/ngbdmodalmachine.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [OrderComponent, OrderCardComponent, LineItemComponent, NgbdmodalmachineComponent],
  imports: [CommonModule, OrderRoutingModule, FormsModule, TranslateModule, NgbModule],
  exports: [LineItemComponent],
  entryComponents: [NgbdmodalmachineComponent]
})
export class OrderModule { }
