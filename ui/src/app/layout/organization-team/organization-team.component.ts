import { Component, OnInit, ViewContainerRef } from '@angular/core';
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
import { TdDialogService } from '@covalent/core/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

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
    private formBuilder: FormBuilder,
    private _dialogService: TdDialogService,
    private translate: TranslateService,
    private toastr: ToastrService
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

  openConfirm(entity): void {
    this._dialogService
      .openConfirm({
        title: this.translate.instant('areYouSure'),
        message: this.translate.instant('removeMemeber'),
        cancelButton: this.translate.instant('no'),
        acceptButton: this.translate.instant('yes'),
        width: '500px',
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.purge(entity).subscribe(
            (result) => {
              this.appStore.dispatch(new fromStore.LoadInitState());
            },
            (err) => {
              if (err.error.details[0] === 'Owner can not delte himself') {
                this.toastr.error(this.translate.instant('ownerCanNotDelteHimself'));
              }
            }
          );
        } else {
        }
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
        if (err.error.details[0] === 'No value present') {
          this.toastr.error(this.translate.instant('emailNotFound'));
        } else if (err.error.details[0] === 'duplicatedOrganizationUser') {
          this.toastr.error(this.translate.instant('duplicatedOrganizationUser'));
        } else if (err.error.details[0] === 'Organization is not active') {
          this.toastr.error(this.translate.instant('organizationIsNotActive'));
        }

        this.loadingService.resolve(this.key);
      }
    );
  }
}
