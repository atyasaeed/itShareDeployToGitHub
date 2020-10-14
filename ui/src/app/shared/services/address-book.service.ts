import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Address } from '../domain/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressBookService extends RestService<Address> {
  resource = 'address';
}
