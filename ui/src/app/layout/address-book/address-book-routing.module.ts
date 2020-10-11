import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressBookFormComponent } from './address-book-form/address-book-form.component';
import { AddressBookComponent } from './address-book.component';

const routes: Routes = [
  { path: '', component: AddressBookComponent },
  { path: 'create', component: AddressBookFormComponent },
  { path: ':entityId', component: AddressBookFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressBookRoutingModule {}
