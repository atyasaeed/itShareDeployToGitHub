import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { LineItem } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class ItemsService extends RestService<LineItem> {
  resource = 'admin/items';

  updateLineItem(lineItem) {
    // return this.http.put('http://18.215.58.131:8080/api/admin/orders/lineItem', lineItem);
    return this.http.put(this.appConfig.getResourceUrl(this.resource), lineItem.id);
  }
  orderReject(id) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/rejectItem`, '');
  }
  orderStatus(id, action) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/${action}`, '');
  }
}
