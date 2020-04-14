import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { ShoppingCartItem, Service } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends RestService<Service> {
  resource: string = 'services';
}
