import { Component, Inject, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { Order, LineItem } from 'src/app/shared/domain';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { OrderService } from 'src/app/shared/services/order.service';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-accept-quotation',
  templateUrl: './accept-quotation.component.html',
  styleUrls: ['./accept-quotation.component.scss'],
  animations: [routerTransition()],
})
export class AcceptQuotationComponent extends DefaultListComponent<Order, OrderService> implements OnInit {
  private _searchTerm = '';
  lang: string;
  checkInput: boolean;
  modalRef: BsModalRef;
  public isCollapsed: boolean[] = [];
  constructor(
    service: OrderService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private modalService: BsModalService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(service, loadingService, translate, toastr);
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
}
