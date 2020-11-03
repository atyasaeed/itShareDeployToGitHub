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
import { Quotation } from 'src/app/shared/domain/quotation.model';
import { QuotationService } from 'src/app/shared/services/quotation.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
  animations: [routerTransition()],
  providers: [QuotationService],
})
export class QuotationComponent extends DefaultListComponent<Quotation, QuotationService> implements OnInit {
  breadcrumbs = [{ heading: 'quotation', icon: 'fa-tasks', link: '/quotation' }];
  private _searchTerm = '';
  lang: string;
  checkInput: boolean;
  modalRef: BsModalRef;
  public isCollapsed: boolean[] = [];
  constructor(
    service: QuotationService,
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
