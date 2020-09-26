import { routerTransition } from 'src/app/router.animations';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { User } from 'src/app/shared/domain';
//import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';

import { OrderService } from 'src/app/shared/services/order.service';

import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  animations: [routerTransition()],
  providers: [UserService],
})
export class UserFormComponent extends DefaultFormComponent<User, UserService> implements OnInit {
  breadcrumbs = [
    { heading: 'Users', icon: 'fa-tasks', link: '/users' },
    { heading: 'User-Details', icon: 'fa-tasks' },
  ];
  lang: string;
  private _searchTerm = '';
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: UserService,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    private orderservice: OrderService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    // service.searchUrl = 'admin';
    this.form = this.formBuilder.group({
      firstName: [{ value: '' }, [Validators.required]],
      lastName: [{ value: '' }, [Validators.required]],
      mobileNo: [{ value: '' }, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [{ value: '' }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      username: [{ value: '' }, [Validators.required]],
    });
  }
  // ngOnInit(): void {
  //   super.ngOnInit();
  // }

  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    this.router.navigateByUrl('users');
  }
  onSave() {
    this.appStore.dispatch(new fromStore.LoadInitState());
    console.log(this.form.value);
  }

  save() {
    this.loadingService.register('loadingUser');
    Object.assign(this.entity, this.form.value);
    if (this.entity.id) {
      this.service.adminUpdateUser(this.entity).subscribe(
        (response) => {
          this.loadingService.resolve('loadingUser');
          this.onSave();
          this.cancel();
        },
        (err) => {
          // this.loadingService.resolve('loadingUser');
          this.loadingService.resolve('loadingUser');
        }
      );
    } else {
      this.service.create(this.entity).subscribe(
        (response) => {
          this.loadingService.resolve('loadingUser');
          this.cancel();
          this.onSave();
        },
        (err) => {
          this.loadingService.resolve('loadingUser');
        }
      );
    }
  }
  onDelete() {
    this.appStore.dispatch(new fromStore.LoadInitState());
  }

  status(entity) {
    this.service.userState(entity.id);
    // entity.enabled = !entity.enabled;
  }
}
