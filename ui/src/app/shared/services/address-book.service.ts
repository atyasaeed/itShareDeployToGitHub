import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { AddressBook } from '../domain/address-book.model';

@Injectable({
  providedIn: 'root',
})
export class AddressBookService extends RestService<AddressBook> {
  resource = 'addressbook';
}
