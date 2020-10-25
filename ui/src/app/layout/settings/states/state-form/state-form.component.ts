import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from 'src/app/router.animations';
import { State } from 'src/app/shared/domain/state.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { StateService } from 'src/app/shared/services/state.service';
import * as fromStore from 'src/app/store';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss'],
  animations: [routerTransition()],
})
export class StateFormComponent extends DefaultFormComponent<State, StateService> implements OnInit {
  breadcrumbs = [
    { heading: 'governorate', icon: 'fa-tasks', link: '/settings/governorate' },
    { heading: 'governorate-Details', icon: 'fa-tasks' },
  ];
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: StateService,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router, translate, toastr);
    this.form = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
    });
  }

  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    this.router.navigateByUrl('settings/governorate');
  }
  onSave() {
    this.appStore.dispatch(new fromStore.LoadInitState());
    console.log(this.form.value);
  }

  onDelete() {
    this.appStore.dispatch(new fromStore.LoadInitState());
  }
}
