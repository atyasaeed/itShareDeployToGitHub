import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/domain';
import { OrdersService } from './orders.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [routerTransition()],
})
export class OrderComponent extends DefaultListComponent<Order, OrdersService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  orders: Array<Order>;

  constructor(service: OrdersService, private appStore: Store<fromStore.AppState>) {
    super(service);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.ordersService.query<Order[]>().subscribe((orders) => (this.orders = orders));
  }
}
