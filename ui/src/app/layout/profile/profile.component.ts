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
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
})
export class ProfileComponent extends DefaultFormComponent<User, UserService> implements OnInit {
  breadcrumbs = [{ heading: 'Update Profile', icon: 'fa-tasks', link: '/profile' }];
  user: User = {} as User;
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: UserService,
    route: ActivatedRoute,
    router: Router,
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
    this.service.getUserProfile().subscribe((res: User) => {
      this.user = res;
      this.form.patchValue(res);
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
