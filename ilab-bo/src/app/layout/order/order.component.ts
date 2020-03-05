import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/shared/domain';
import { NgbdSortableHeader, SortEvent } from '../user/sortable.directive';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orders$: Observable<Order[]>;
  total$: Observable<number>;
  // orders: Array<Order>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  constructor(private orderService: OrderService) {
    this.orders$ = orderService.order$;
    this.total$ = orderService.total$;
  }

  // status: string;
  ngOnInit() {
    // this.orderService.query<Order[]>().subscribe(orders => (this.orders = orders));
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.orderService.sortColumn = column;
    this.orderService.sortDirection = direction;
  }
}
