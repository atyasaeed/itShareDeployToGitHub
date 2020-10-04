import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/shared/domain/organization.model';
import { OrgUserService } from 'src/app/shared/services/org-user.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { TdLoadingService } from '@covalent/core/loading';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';

@Component({
  selector: 'app-organization-team',
  templateUrl: './organization-team.component.html',
  styleUrls: ['./organization-team.component.scss'],
})
export class OrganizationTeamComponent extends DefaultListComponent<Organization, OrgUserService> implements OnInit {
  breadcrumbs = [{ heading: 'Users', icon: 'fa-tasks' }];
  lang: string;
  private _searchTerm = '';

  constructor(service: OrgUserService, private appStore: Store<fromStore.AppState>, loadingService: TdLoadingService) {
    super(service, loadingService);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `email:'*${searchTerm}*' OR username:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity) {
    // this.purge(entity).subscribe((result) => {
    //   this.appStore.dispatch(new fromStore.LoadInitState());
    // });
    this.service.delete(entity.id);
  }
}
