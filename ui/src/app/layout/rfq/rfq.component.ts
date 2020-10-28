import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
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
import { RFQ } from 'src/app/shared/domain/rfq.model ';
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
export class RfqComponent extends DefaultListComponent<RFQ, RFQService> implements OnInit {
  breadcrumbs = [{ heading: 'RFQs', icon: 'fa-tasks', link: '/RFQs' }];
  private _searchTerm = '';
  lang: string;
  checkInput: boolean;
  modalRef: BsModalRef;
  public isCollapsed: boolean[] = [];
  duration: string;
  unitPrice: string;
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
    if (!(lineitem.duration > 0 && lineitem.unitPrice > 0)) {
      this.checkInput = true;
      return;
    }
    this.modalRef = this.modalService.show(template);
  }
  confirmQuoteItem(rfq: RFQ) {
    this.loadingService.register(this.key);
    let quotation: Quotation = {} as Quotation;
    quotation.unitPrice = rfq.unitPrice;
    quotation.duration = rfq.duration;
    this.lineItemService.quoteItem(quotation, rfq.id).subscribe(
      (res) => {
        if (res == null) {
          this.toastr.warning(this.translate.instant('sorryTryAgainLater'));
          this.loadingService.resolve(this.key);
          return;
        }
        this.toastr.success(this.translate.instant('quoted'));
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.error.details[0]));
        this.loadingService.resolve(this.key);
      }
    );
  }
}
