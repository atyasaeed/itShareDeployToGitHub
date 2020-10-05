import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { OrgUser } from 'src/app/shared/domain/orgUser.model';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { OrgUserService } from 'src/app/shared/services/org-user.service';
import { getLang } from 'src/app/store';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-my-organizations',
  templateUrl: './my-organizations.component.html',
  styleUrls: ['./my-organizations.component.scss'],
  animations: [routerTransition()],
})
export class MyOrganizationsComponent extends DefaultListComponent<OrgUser, OrgUserService> implements OnInit {
  breadcrumbs = [{ heading: 'my-organizations', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;

  constructor(service: OrgUserService, loadingService: TdLoadingService, private appStore: Store<fromStore.AppState>) {
    super(service, loadingService);
    this.service.searchUrl = 'search/user';
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `id:'*${searchTerm.toLowerCase()}*' OR name:'*${searchTerm.toLowerCase()}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
}
