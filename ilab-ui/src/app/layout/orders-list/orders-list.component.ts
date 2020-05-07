import { Entity } from './../../shared/domain/entity';
import { Order } from 'src/app/shared/domain';
import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { OrdersListService } from './orders-list.service';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  animations: [routerTransition()],
})
export class OrdersListComponent extends DefaultListComponent<Order, OrdersListService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(service: OrdersListService) {
    super(service);
    // this.appStore.select(fromStore.getLang).subscribe((lang) => {
    //   this.lang = lang;
    // });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `status:'*${searchTerm}*' OR total_payment:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity) {
    // this.purge(entity).subscribe((result) => {
    //   this.appStore.dispatch(new fromStore.LoadInitState());
    // });
  }
  public getSubTotal(lineItems) {
    return lineItems.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }
}
