import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/domain';
import { OrdersService } from './orders.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TdLoadingService } from '@covalent/core/loading';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [routerTransition()],
})
export class OrderComponent extends DefaultListComponent<Order, OrdersService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  orders: Array<Order>;
  dropdownList: string[] = ['PENDING', 'QUOTED', 'IN_PROGRESS', 'FINISHED', 'DELIVERED'];
  selectedItems: string[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(service: OrdersService, private appStore: Store<fromStore.AppState>, loadingService: TdLoadingService) {
    super(service, loadingService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.service.sortColumn = 'created';
    this.service.sortDirection = 'desc';
    // this.ordersService.query<Order[]>().subscribe((orders) => (this.orders = orders));
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  sortByDate(value: string) {
    //this.service.sortColumn = 'updated_at';
    if (value == 'newest') {
      this.service.sortDirection = 'desc';
    } else if (value == 'oldest') {
      this.service.sortDirection = 'asc';
    }
  }

  onItemSelect(item) {
    //this.objectPropertyToArrayString(this.selectedItems);
    this.service.advSearch = 'status=' + this.selectedItems.toString();
  }

  onItemDeSelect(item) {
    //this.objectPropertyToArrayString(this.selectedItems);
    this.service.advSearch = 'status=' + this.selectedItems.toString();
  }

  onSelectAll(items) {
    this.service.advSearch = 'status=' + items.toString();
  }

  onDeSelectAll(items) {
    this.service.advSearch = '';
  }
}
