import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { Quotation } from 'src/app/shared/domain/quotation.model';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { getLang } from 'src/app/store';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss'],
  animations: [routerTransition()],
})
export class RfqListComponent extends DefaultListComponent<Quotation, RfqService> implements OnInit {
  breadcrumbs = [
    { heading: 'orders', link: '/orders-list' },
    { heading: 'orderDetails', link: '' },
    { heading: 'itemRFQs' },
  ];
  private _searchTerm = '';
  lang: string;
  modalRef: BsModalRef;
  constructor(
    service: RfqService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private modalService: BsModalService,
    private router: Router
  ) {
    super(service, loadingService);
    // service.searchUrl = 'search/admin';
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.breadcrumbs[1].link = this.router.getCurrentNavigation()?.extras.state.adminOrderRoute;
    }
  }

  ngOnInit() {}

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `name:'*${searchTerm}*' `;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }
}
