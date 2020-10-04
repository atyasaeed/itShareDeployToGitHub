import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/shared/domain/organization.model';
import { OrgUserService } from 'src/app/shared/services/org-user.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { TdLoadingService } from '@covalent/core/loading';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { routerTransition } from 'src/app/router.animations';
import { OrgUser } from 'src/app/shared/domain/orgUser.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organization-team',
  templateUrl: './organization-team.component.html',
  styleUrls: ['./organization-team.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationTeamComponent extends DefaultListComponent<OrgUser, OrgUserService> implements OnInit {
  breadcrumbs = [{ heading: 'organization-team', icon: 'fa-tasks' }];
  lang: string;
  private _searchTerm = '';
  loading: boolean;
  email = new FormControl('', [Validators.required, Validators.email]);
  constructor(
    service: OrgUserService,
    private appStore: Store<fromStore.AppState>,
    loadingService: TdLoadingService,
    private formBuilder: FormBuilder
  ) {
    super(service, loadingService);
    this.service.searchUrl = 'search/org';
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
    this.purge(entity).subscribe((result) => {
      this.appStore.dispatch(new fromStore.LoadInitState());
    });
  }
  save() {
    this.loadingService.register(this.key);
    this.service.inviteUser(this.email.value).subscribe(
      (res: OrgUser) => {
        this.service.searchTerm = '';
        this.email.reset();
      },
      (err) => {
        console.log(err);
        this.loadingService.resolve(this.key);
      }
    );
  }
}
