import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Reason } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';
import { TdLoadingService } from '@covalent/core/loading';
import { ReasonService } from 'src/app/shared/services/reason.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getLang } from 'src/app/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

// import { ReasonsService } from './reasons.service';

@Component({
  selector: 'app-reasons-list',
  templateUrl: './reasons-list.component.html',
  styleUrls: ['./reasons-list.component.scss'],
  animations: [routerTransition()],
  providers: [ReasonService],
})
export class ReasonsListComponent extends DefaultListComponent<Reason, ReasonService> implements OnInit {
  breadcrumbs = [{ heading: 'reasons', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(
    service: ReasonService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(service, loadingService, translate, toastr);
    service.searchUrl = 'search/admin';
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

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
  // delete(entity) {}
}
