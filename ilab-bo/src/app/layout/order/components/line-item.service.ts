import { Injectable } from '@angular/core';
import { RestService } from '../../../shared/services/rest-service';

@Injectable({
  providedIn: 'root'
})
export class LineItemService extends RestService {
  resource: string = 'orders/search';

}
