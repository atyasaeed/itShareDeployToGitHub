import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { User } from 'src/app/shared/domain';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { routerTransition } from 'src/app/router.animations';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { City } from 'src/app/signup/signup-partner/city';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { Organization } from 'src/app/shared/domain/organization.model';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationFormComponent extends DefaultFormComponent<Organization, OrganizationService>
  implements OnInit {
  breadcrumbs = [
    { heading: 'organization', icon: 'fa-tasks', link: '/organizations' },
    { heading: 'organization-Details', icon: 'fa-tasks' },
  ];
  user: User = {} as User;
  org: Organization = {} as Organization;
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrganizationService,
    route: ActivatedRoute,
    router: Router,
    private userService: UserService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);

    this.form = this.formBuilder.group({
      id: [''],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      firstName: [''],
      lastName: [''],
      mobileNo: [''],
    });
    if (this.router.getCurrentNavigation()?.extras.state) {
      Object.assign(this.org, this.router.getCurrentNavigation().extras.state);
      this.form.patchValue(this.org.owner);
      this.user = this.org.owner;
      this.user.defaultOrg = this.org;
    }
  }
  save() {
    this.org.owner = this.form.value;
    this.service.updateAdminOrg(this.org, this.org.id).subscribe((res) => {
      console.log(res);
    });
  }
  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    this.router.navigateByUrl(this.breadcrumbs[0].link);
  }
  onSave() {
    this.appStore.dispatch(new fromStore.LoadInitState());
  }
  onDelete() {
    this.appStore.dispatch(new fromStore.LoadInitState());
  }
}
