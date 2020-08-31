import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/domain';
import { OrderService } from '../../shared/services/order.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TdLoadingService } from '@covalent/core/loading';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  animations: [routerTransition()],
})
export class OrderComponent extends DefaultListComponent<Order, OrderService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  orders: Array<Order>;
  openedOrders: string[] = ['PENDING', 'QUOTED', 'QUOTE_ACCEPTED', 'IN_PROGRESS', 'FINISHED'];
  closedOrders: string[] = ['CANCELLED', 'ORDER_REJECTED', 'QUOTE_REJECTED', 'ORDER_EXPIRED', 'DELIVERED'];
  //dropdownList: string[] = ['PENDING', 'QUOTED', 'IN_PROGRESS', 'FINISHED', 'DELIVERED'];
  //selectedItems: string[] = [];
  //dropdownSettings: IDropdownSettings = {};
  singleOrder;
  constructor(
    service: OrderService,
    private appStore: Store<fromStore.AppState>,
    loadingService: TdLoadingService,
    private activeRoute: ActivatedRoute
  ) {
    super(service, loadingService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.singleOrder = this.activeRoute.snapshot.params['entityId'];
    if (this.singleOrder) {
      this.service.searchTerm = `id:'*${this.singleOrder}*'`;
    } else {
      this.service.sortColumn = 'created';
      this.service.sortDirection = 'desc';

      // this.dropdownSettings = {
      //   singleSelection: false,
      //   textField: 'item_text',
      //   selectAllText: 'Select All',
      //   unSelectAllText: 'UnSelect All',
      //   itemsShowLimit: 3,
      //   allowSearchFilter: true,
      // };
    }
  }

  sortByDate(value: string) {
    if (value == 'newest') {
      this.service.sortDirection = 'desc';
    } else if (value == 'oldest') {
      this.service.sortDirection = 'asc';
    }
  }

  filterByOrderStatus(value: string) {
    if (value === 'all') {
      this.service.searchTerm = '';
    } else if (value === 'opened') {
      this.service.searchTerm = 'status=' + this.openedOrders.toString();
    } else if (value === 'closed') {
      this.service.searchTerm = 'status=' + this.closedOrders.toString();
    }
  }

  // onItemSelect(item) {

  //   this.service.advSearch = 'status=' + this.selectedItems.toString();
  // }

  // onItemDeSelect(item) {
  //   this.service.advSearch = 'status=' + this.selectedItems.toString();
  // }

  // onSelectAll(items) {
  //   this.service.advSearch = 'status=' + items.toString();
  // }

  // onDeSelectAll(items) {
  //   this.service.advSearch = '';
  // }
}
