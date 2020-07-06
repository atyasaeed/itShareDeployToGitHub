import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
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
import { AlertService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { LineItem } from 'src/app/shared/domain';

@Component({
  selector: 'app-orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss'],
  animations: [routerTransition()],
})
export class OrdersFormComponent extends DefaultFormComponent<Order, OrdersListService> {
  breadcrumbs = [
    { heading: 'Orders', icon: 'fa-tasks', link: '/orders-list' },
    { heading: 'Order-Details', icon: 'fa-tasks' },
  ];

  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrdersListService,
    route: ActivatedRoute,
    router: Router,
    private alertService: AlertService,
    private toastr: ToastrService,

    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      // id: [{ value: '', disabled: true }],
    });
  }

  public getSubTotal(lineItems: LineItem[]) {
    let sum = 0;
    lineItems.forEach((e) => {
      if (e.unitPrice) {
        sum += e.unitPrice;
      }
    });
    console.log(sum);

    return sum;
    // return lineItems.map((rr) => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }
  getFileUrl(entity: LineItem): string {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    return this.appConfig.FILE_URL + entity.files[0].asset_id;
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
  updateItem(lineItem: LineItem) {
    if (lineItem.unitPrice && lineItem.estimatedEndDate) {
      this.service.updateLineItem(lineItem).subscribe((res) => {
        this.toastr.success('Update Successful');
      });
    } else {
      this.toastr.error('Please Enter Price and Estimated End Date For This Item');
    }
  }

  getFileExtension(entity: LineItem) {
    //return this.appConfig.FILE_URL + entity.files[fileIndex].asset_id;
    let extension = entity.files[0].asset_name.split('.');
    if (
      extension[extension.length - 1].toLowerCase() == 'png' ||
      extension[extension.length - 1].toLowerCase() == 'jpg'
    ) {
      return this.appConfig.FILE_URL + entity.files[0].asset_id;
    } else {
      return false;
    }
  }
  checkLineItems(lineItems: LineItem[]) {
    let found = true;
    lineItems.forEach((e) => {
      if (!e.unitPrice || !e.estimatedEndDate) {
        found = false;
      }
    });
    return found;
  }

  orderStatus(status: string, statusBtn: HTMLElement) {
    switch (status) {
      case 'PENDING':
        statusBtn.innerText = 'WATTING_FOR_APPROVE';
        // this.entity.status = 'WATTING_FOR_APPROVEL';
        this.entity.status = 'APPROVED';
        break;
      case 'APPROVED':
        statusBtn.innerText = 'In Progress';
        this.entity.status = 'IN_PROGRESS';
        break;
      case 'IN_PROGRESS':
        statusBtn.innerText = 'In Progress';
        this.entity.status = 'Ready_For_Delivery';
        break;
      case 'Ready_For_Delivery':
        statusBtn.innerText = 'Delivered';
        this.entity.status = 'Delivered';
        break;
      case 'Delivered':
        // statusBtn.innerText = '';
        // this.entity.status = 'Delivered';
        break;
      default:
        break;
    }
  }
}
