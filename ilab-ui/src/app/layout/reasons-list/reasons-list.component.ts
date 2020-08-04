import { Component, OnInit, Inject } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Reason } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';
import { TdLoadingService } from '@covalent/core/loading';
import { ReasonsService } from 'src/app/shared/services/reasons.service';

// import { ReasonsService } from './reasons.service';

@Component({
  selector: 'app-reasons-list',
  templateUrl: './reasons-list.component.html',
  styleUrls: ['./reasons-list.component.scss'],
  animations: [routerTransition()],
})
export class ReasonsListComponent extends DefaultListComponent<Reason, ReasonsService> implements OnInit {
  breadcrumbs = [{ heading: 'Reasons', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(service: ReasonsService, loadingService: TdLoadingService) {
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
