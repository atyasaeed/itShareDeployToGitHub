import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/domain';
import { OrdersService } from './orders.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends DefaultListComponent<Order, OrdersService> implements OnInit {
  orders: Array<Order>;

  constructor(service: OrdersService, private appStore: Store<fromStore.AppState>) {
    super(service);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.ordersService.query<Order[]>().subscribe((orders) => (this.orders = orders));
  }
}
