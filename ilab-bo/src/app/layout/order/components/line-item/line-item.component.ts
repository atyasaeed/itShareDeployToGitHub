import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';
import { Order } from 'src/app/shared/domain';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit {
  //@Input() lineItem: LineItem;
  order: Order;
  max: any
  dateArray: any[] = [];
  status: any
  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    @Inject(APP_CONFIG) private appConfig: IAppConfig) {
    // console.log(this.router.getCurrentNavigation().extras.state);
    // this.order = this.router.getCurrentNavigation().extras.state
  }


  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('order');

    this.order = history.state;
    this.getDeliveryDate();
  }

  getDeliveryDate() {
    for (let index = 0; index < this.order.lineItems.length; index++) {
      this.dateArray.push(this.order.lineItems[index].estimatedEndDate)
    }
    this.max = this.dateArray.reduce(function (a, b) { return a > b ? a : b; });
  }

  getFileUrl(indexItem, index): string {
    return this.appConfig.FILE_URL + this.order.lineItems[indexItem].files[index].asset_id;
  }
  public getSubTotal() {
    return this.order.lineItems.map(rr => rr.unitPrice * rr.quantity).reduce((a, b) => a + b, 0);
  }

  // getFileUrl(index): string {
  //   return this.appConfig.FILE_URL + this.lineItem.files[index].asset_id;
  // }

}
