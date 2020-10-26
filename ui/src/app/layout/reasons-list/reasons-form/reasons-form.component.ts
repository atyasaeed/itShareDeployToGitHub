import { Component, OnInit } from '@angular/core';
import { Reason } from 'src/app/shared/domain';
// import { ReasonsService } from '../reasons.service';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';
import { ReasonService } from 'src/app/shared/services/reason.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reasons-form',
  templateUrl: './reasons-form.component.html',
  styleUrls: ['./reasons-form.component.scss'],
  animations: [routerTransition()],
})
export class ReasonsFormComponent extends DefaultFormComponent<Reason, ReasonService> implements OnInit {
  breadcrumbs = [{ heading: 'reasons', icon: 'fa-tasks', link: '/reasons-list' }];
  lang: string;
  private _searchTerm = '';
  statuses$ = ['DRAFT', 'PUBLISHED', 'DELETED'];

  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: ReasonService,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    private orderservice: OrderService,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router, translate, toastr);
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', [Validators.required]],
    });
  }

  onCreate(): void {}
  onUpdate(): void {}
  cancel(): void {
    this.router.navigateByUrl('reasons-list');
  }
}
