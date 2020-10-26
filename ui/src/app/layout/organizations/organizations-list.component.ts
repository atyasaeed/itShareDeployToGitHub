import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { TdLoadingService } from '@covalent/core/loading';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { Organization } from 'src/app/shared/domain/organization.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getLang } from 'src/app/store';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationsListComponent extends DefaultListComponent<Organization, OrganizationService>
  implements OnInit {
  breadcrumbs = [{ heading: 'organizations', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  statusDropdownList: string[] = ['PENDING', 'WAITING_APPROVAL', 'REJECTED', 'SUSPENDED', 'ACTIVE'];
  statusSelectedItems: string[] = [];
  dropdownSettings: IDropdownSettings;
  constructor(
    service: OrganizationService,
    loadingService: TdLoadingService,
    private http: HttpClient,
    private appStore: Store<fromStore.AppState>,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(service, loadingService, translate, toastr);
    service.searchUrl = 'search/partners';
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight: 197,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  onItemSelect(item) {
    this.service.searchParams = 'status=' + this.statusSelectedItems.toString();
  }
  onDeSelect(item) {
    this.service.searchParams = 'status=' + this.statusSelectedItems.toString();
  }
  onSelectAll(items) {
    this.service.searchParams = 'status=' + items.toString();
  }
  onDeSelectAll(items) {
    this.service.searchParams = 'status=' + items.toString();
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `id:'*${searchTerm.toLowerCase()}*' OR name:'*${searchTerm.toLowerCase()}*' OR city:'*${searchTerm.toLowerCase()}*' OR mobileNo:'*${searchTerm.toLowerCase()}*' OR owner.firstName:'*${searchTerm.toLowerCase()}*' OR owner.email:'*${searchTerm.toLowerCase()}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity) {}
}
