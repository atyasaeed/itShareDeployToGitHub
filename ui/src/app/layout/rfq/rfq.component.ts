import { Component, Inject, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { Order, LineItem } from 'src/app/shared/domain';
import { Quotation } from 'src/app/shared/domain/quotation.model';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { LineItemService } from 'src/app/shared/services/line-item.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { RFQService } from 'src/app/shared/services/rfq.service';
import * as fromStore from 'src/app/store';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss'],
  animations: [routerTransition()],
})
export class RfqComponent extends DefaultListComponent<LineItem, RFQService> implements OnInit {
  breadcrumbs = [{ heading: 'RFQs', icon: 'fa-tasks', link: '/RFQs' }];
  private _searchTerm = '';
  lang: string;
  checkInput: boolean;
  modalRef: BsModalRef;
  public isCollapsed: boolean[] = [];
  constructor(
    service: RFQService,
    private lineItemService: LineItemService,
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
    return this.appConfig.FILE_URL + entity.files[0].asset_id;
  }

  quoteItem(lineitem: LineItem, template) {
    if (!(lineitem.duration > 0 && lineitem.unitPrice)) {
      this.checkInput = true;
      return;
    }
    this.modalRef = this.modalService.show(template);
  }
  confirmQuoteItem(lineitem: LineItem) {
    console.log(lineitem);
    let quotation: Quotation = {} as Quotation;
    quotation.unitPrice = lineitem.unitPrice;
    quotation.duration = lineitem.duration;
    this.lineItemService.quoteItem(quotation, lineitem.id).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('quoted'));
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.error.details[0]));
      }
    );
  }
}
