import { Component, Inject, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { LineItem, Order } from 'src/app/shared/domain';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { OrderService } from 'src/app/shared/services/order.service';
import * as fromStore from 'src/app/store';

@Component({
  selector: 'app-quotation-requests',
  templateUrl: './quotation-requests.component.html',
  styleUrls: ['./quotation-requests.component.scss'],
  animations: [routerTransition()],
})
export class QuotationRequestsComponent extends DefaultListComponent<Order, OrderService> implements OnInit {
  breadcrumbs = [{ heading: 'RFQs', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  checkInput: boolean
   modalRef: BsModalRef;
  public isCollapsed: boolean[] = [];
  constructor(
    service: OrderService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private modalService: BsModalService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    super(service, loadingService);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }
  // ngOnInit(): void {
  // }
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
  getFileExtension(entity: LineItem) {
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return 'image';
    } else if (extension[extension.length - 1].toLowerCase() == 'stl') {
      return 'stl';
    } else {
      return null;
    }
  }
  getFileUrl(entity: LineItem): string {
    return this.appConfig.FILE_URL_ADMIN + entity.files[0].asset_id;
  }

  quoteItem(lineitem: LineItem,template) {
    if (!(lineitem.duration > 0 && lineitem.unitPrice)) {
      this.checkInput = true
return
    }
    this.modalRef = this.modalService.show(template);
  }
  confirmQuoteItem(lineitem: LineItem) {
    console.log(lineitem)

  }

}
