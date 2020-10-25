//import { Entity } from './../../shared/domain/entity';
import { Order, LineItem } from 'src/app/shared/domain';
import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';

import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TdLoadingComponent, TdLoadingService } from '@covalent/core/loading';
import { OrderService } from 'src/app/shared/services/order.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getLang } from 'src/app/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  animations: [routerTransition()],
  providers: [OrderService],
})
export class OrdersListComponent extends DefaultListComponent<Order, OrderService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  dropdownList: string[] = [];
  selectedItems = [];
  // dropdownSettings = {};
  dropdownSettings: IDropdownSettings = {};
  constructor(
    service: OrderService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(service, loadingService, translate, toastr);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
    service.searchUrl = 'search/admin';
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
  onItemSelect(item: any) {}
  onItemDeSelect(item) {}
  onSelectAll(items: any) {}

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
