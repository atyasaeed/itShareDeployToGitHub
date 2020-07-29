import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LineItem } from 'src/app/shared/domain';
import { RestService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class LineItemService extends RestService<LineItem> {
  resource: string = 'items';
  //searchUrl = 'advSearch';
  approve(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl('items') + '/' + id + '/approveQuote', null);
  }
  cancel(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl('items') + '/' + id + '/cancel', null);
  }
  reject(id: string) {
    return this.http.put<LineItem>(this.appConfig.getResourceUrl('items') + '/' + id + '/rejectQuote', null);
  }
}
