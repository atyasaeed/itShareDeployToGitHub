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
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationFormComponent extends DefaultFormComponent<Organization, OrganizationService>
  implements OnInit {
  breadcrumbs = [
    { heading: 'organization', icon: 'fa-tasks', link: '/organizations-list' },
    { heading: 'organization-Details', icon: 'fa-tasks' },
  ];
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
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router, translate, toastr);
    if (this.router.getCurrentNavigation()?.extras.state) {
      Object.assign(this.org, this.router.getCurrentNavigation().extras.state);
    } else {
      this.route.params.subscribe((param) => {
        console.log(param.entityId);
        this.service.getOrgAdmin(param.entityId).subscribe((res: Organization) => {
          this.org = res;
        });
      });
    }
  }
  ngOnInit() {}
  onCreate(): void {}
  onUpdate(): void {}
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
