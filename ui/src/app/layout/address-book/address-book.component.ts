import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { AddressBook } from 'src/app/shared/domain/address-book.model';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { AddressBookService } from 'src/app/shared/services/address-book.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { HttpClient } from '@angular/common/http';
import { getLang } from 'src/app/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss'],
  animations: [routerTransition()],
})
export class AddressBookComponent extends DefaultListComponent<AddressBook, AddressBookService> implements OnInit {
  breadcrumbs = [{ heading: this.translate.instant('addressBook') }];
  private _searchTerm = '';
  lang: string;
  modalRef: BsModalRef;
  constructor(
    service: AddressBookService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private http: HttpClient,
    private modalService: BsModalService
  ) {
    super(service, loadingService);
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `state:'*${searchTerm.toLowerCase()}*' OR city:'*${searchTerm.toLowerCase()}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity: AddressBook) {
    this.loadingService.register(this.key);
    this.purge(entity).subscribe(
      (result) => {
        super.ngOnInit();
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }
  setPrimeAddress(entity: AddressBook) {}
  openModal(template) {
    this.modalRef = this.modalService.show(template);
  }
}
