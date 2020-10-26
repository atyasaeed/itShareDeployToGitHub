//import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
//import { Store } from '@ngrx/store';
//import { TranslateService } from '@ngx-translate/core';
//import * as fromStore from 'src/app/store';

// import { ActivatedRoute } from '@angular/router';
// import { RestService } from 'src/app/shared/services';
// import { ToastrService } from 'ngx-toastr';

import { Order } from 'src/app/shared/domain';
import { TdLoadingService } from '@covalent/core/loading';
import { routerTransition } from 'src/app/router.animations';
import { OrderService } from 'src/app/shared/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-linkable',
  templateUrl: './linkable.component.html',
  styleUrls: ['./linkable.component.scss'],
  animations: [routerTransition()],
})
export class LinkableComponent extends DefaultListComponent<Order, OrderService> implements OnInit {
  breadcrumbs = [{ heading: 'Orders', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(
    service: OrderService,
    loadingService: TdLoadingService,
    toastr: ToastrService,
    translate: TranslateService
  ) {
    super(service, loadingService, translate, toastr);
    // this.appStore.select(fromStore.getLang).subscribe((lang) => {
    //   this.lang = lang;
    // });
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
  public getSubTotal(lineItems) {
    return lineItems?.map((rr) => rr?.unitPrice * rr?.quantity).reduce((a, b) => a + b, 0);
  }
}
