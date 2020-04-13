import { Component, OnInit, Inject } from '@angular/core';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { ProfileService } from './profile.service';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { User } from 'src/app/shared/domain';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
})
export class ProfileComponent extends DefaultFormComponent<User, ProfileService> implements OnInit {
  breadcrumbs = [{ heading: 'Update Profile', icon: 'fa-tasks', link: '/home' }];

  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: ProfileService,
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
      arName: [{ value: '', disabled: true }],
      enName: [{ value: '', disabled: true }],
      nationality: [{ value: '', disabled: true }, [Validators.required]],
      idNumber: [{ value: '', disabled: true }, Validators.required],
      // gender: [true, [Validators.required]],
      birthdate: [{ value: '', disabled: true }, [Validators.required]],
      department: this.formBuilder.group({
        id: [''],
        faculty: this.formBuilder.group({
          id: [''],
          university: this.formBuilder.group({
            id: [''],
          }),
        }),
      }),

      // degree: ['', [Validators.required]],
      empCase: this.formBuilder.group({
        id: [''],
      }),

      degree: this.formBuilder.group({
        id: ['', Validators.required],
      }),
      // file: ['', [Validators.required]],
      phoneNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      homePhoneNo: ['', [Validators.pattern('^[0-9]*$')]],
    });
  }
  ngOnInit() {
    this.loadingService.register(this.key);
    this.service.get('').subscribe((entity) => {
      this.form.patchValue(entity);
      this.entity = entity;
      console.log(this.entity);
      this.loadingService.resolve(this.key);
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
