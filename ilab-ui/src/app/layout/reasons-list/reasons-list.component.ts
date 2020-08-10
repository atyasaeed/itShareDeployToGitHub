import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Reason } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';
import { TdLoadingService } from '@covalent/core/loading';
import { ReasonService } from 'src/app/shared/services/reason.service';

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
  constructor(service: ReasonService, loadingService: TdLoadingService) {
    super(service, loadingService);
    service.searchUrl = 'search/admin';
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
