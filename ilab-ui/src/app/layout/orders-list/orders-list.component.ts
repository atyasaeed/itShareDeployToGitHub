import { Entity } from './../../shared/domain/entity';
import { Order, LineItem } from 'src/app/shared/domain';
import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { OrdersListService } from './orders-list.service';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  dropdownList: string[] = [];
  selectedItems = [];
  // dropdownSettings = {};
  dropdownSettings: IDropdownSettings = {};
  constructor(service: OrdersListService) {
    super(service);
    // this.appStore.select(fromStore.getLang).subscribe((lang) => {
    //   this.lang = lang;
    // });
    this.dropdownList = [
      'PENDING',
      'QUOTED',
      'QUOTE_ACCEPTED',
      'IN_PROGRESS',
      'FINISHED',
      'DELIVERED',
      'CANCELLED',
      'QUOTE_REJECTED',
    ];
    this.dropdownSettings = {
      // idField: 'item_id',
      // textField: 'item_text',
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems.toString());
  }
  onItemDeSelect(item) {
    console.log(item);
    console.log(this.selectedItems.toString());
  }
  onSelectAll(items: any) {
    console.log(items);
    console.log(items.toString());
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `status:'*${searchTerm}*' OR id:'*${searchTerm}*'`;
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
  public getSubTotal(lineItems: LineItem[]) {
    let sum = 0;
    lineItems.forEach((e) => {
      if (e?.unitPrice) {
        sum += e.unitPrice;
      }
    });
    //return lineItems?.map((rr) => rr?.unitPrice * rr?.quantity).reduce((a, b) => a + b, 0);
    return sum;
  }
}
