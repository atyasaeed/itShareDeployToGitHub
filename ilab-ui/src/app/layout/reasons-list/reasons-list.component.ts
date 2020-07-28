import { Component, OnInit, Inject } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Reason } from 'src/app/shared/domain';

import { routerTransition } from 'src/app/router.animations';
import { ReasonsService } from './reasons.service';

import { TdLoadingService } from '@covalent/core/loading';
import { IAppConfig, APP_CONFIG } from 'src/app/shared/app.config';
import { HttpClient } from '@angular/common/http';

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
  constructor(
    service: ReasonsService,
    loadingService: TdLoadingService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) {
    super(service, loadingService);

    this.http.get(this.appConfig.API_END_POINT + 'api/reason/search/admin').subscribe((res: any) => {
      this.entities$ = res.content;
      console.log(res.content);
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
