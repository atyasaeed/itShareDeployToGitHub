import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends RestService {
  resource: string = 'orders';

}
