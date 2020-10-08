import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressBookRoutingModule } from './address-book-routing.module';
import { AddressBookFormComponent } from './address-book-form/address-book-form.component';
import { AddressBookComponent } from './address-book.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddressBookComponent, AddressBookFormComponent],
  imports: [
    CommonModule,
    AddressBookRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule,
    PageHeaderModule,
    CovalentLoadingModule,
    CovalentDialogsModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot(),
    NgSelectModule,
  ],
})
export class AddressBookModule {}
