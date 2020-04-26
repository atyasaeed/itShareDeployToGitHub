import { Component, OnInit, Inject } from '@angular/core';
import { Order } from 'src/app/shared/domain/order.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrdersListService } from '../../orders-list/orders-list.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ProfileService } from '../../profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss'],
  animations: [routerTransition()],
})
export class OrdersFormComponent extends DefaultFormComponent<Order, OrdersListService> {
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrdersListService,
    route: ActivatedRoute,
    router: Router,
    @Inject(APP_CONFIG) private appConfig: IAppConfig
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
    });
  }
  public getSubTotal(lineItems) {
    return lineItems.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }
  getFileUrl(file): string {
    return this.appConfig.FILE_URL + file.asset_id;
  }
  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'Update Profile', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    // this.router.navigateByUrl(this.breadcrumbs[0].link);
  }
}
