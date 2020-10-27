import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LineItem } from 'src/app/shared/domain';
import { RestService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class LineItemService extends RestService<LineItem> {
  resource: string = 'item';
  //searchUrl = 'advSearch';
  approve(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/approveQuote', null);
  }
  cancel(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/cancel', null);
  }
  reject(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl(this.resource) + '/' + id + '/rejectQuote', null);
  }

  updateLineItem(lineItem) {
    // return this.http.put('http://18.215.58.131:8080/api/admin/orders/lineItem', lineItem);
    return this.http.put(this.appConfig.getResourceUrl(this.resource), lineItem.id);
  }
  itemReject(id, rejectionReason: LineItem) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/rejectItem`, rejectionReason);
  }
  itemStatus(id, action: string) {
    return this.http.put(this.appConfig.getResourceUrl(this.resource) + `/${id}/${action}`, '');
  }
}
