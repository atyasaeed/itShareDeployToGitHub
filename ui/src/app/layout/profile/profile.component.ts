import { Component, OnInit, Inject } from '@angular/core';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { User } from 'src/app/shared/domain';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
})
export class ProfileComponent extends DefaultFormComponent<User, UserService> implements OnInit {
  breadcrumbs = [{ heading: 'Update Profile', icon: 'fa-tasks', link: '/profile' }];
  user: User = {} as User;
  checkFragment: boolean;
  accountInfo = 'accountInfo';
  orgInfo = 'orgInfo';
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: UserService,
    route: ActivatedRoute,
    router: Router,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router, translate, toastr);

    this.service.getUserProfile().subscribe((res: User) => {
      this.user = res;
    });

    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.checkFragment = true;
        this.accountInfo = 'orgInfo';
        this.orgInfo = 'accountInfo';
      }
    });
  }
  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
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
