import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Quotation } from 'src/app/shared/domain/quotation.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss'],
  animations: [routerTransition()],
})
export class RfqComponent extends DefaultFormComponent<Quotation, RfqService> implements OnInit {
  breadcrumbs = [{ heading: 'RFQ-Settings' }];
  lang: string;
  private _searchTerm = '';

  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: RfqService,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      expirationDuration: ['', [Validators.required, Validators.pattern(/(?<=\s|^)\d+(?=\s|$)/)]],
    });
  }

  onCreate(): void {}
  onUpdate(): void {}
  cancel(): void {
    this.router.navigateByUrl('');
  }
}
