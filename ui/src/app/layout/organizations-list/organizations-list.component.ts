import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { TdLoadingService } from '@covalent/core/loading';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { Organization, City } from 'src/app/shared/domain/organization.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
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
  cityDropdownList: string[] = [];
  statusDropdownList: string[] = ['PENDING', 'WAITING_APPROVAL', 'REJECTED', 'SUSPENDED', 'ACTIVE'];
  statusSelectedItems: string[] = [];
  citySelectedItems: string[] = [];
  dropdownSettings: IDropdownSettings;
  constructor(
    service: OrganizationService,
    loadingService: TdLoadingService,
    private http: HttpClient,
    private translate: TranslateService,
    private appStore: Store<fromStore.AppState>
  ) {
    super(service, loadingService);
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
    this.http.get('assets/cities.json').subscribe((res: City[]) => {
      this.appStore.select(fromStore.getLang).subscribe((lang) => {
        let arr = this.citySelectedItems;
        this.cityDropdownList = [];
        this.citySelectedItems = [];
        if (lang === 'en') {
          res.map((item: City) => {
            this.cityDropdownList.push(item.enName);
          });
          res.forEach((e) => {
            arr.forEach((x) => {
              if (e.arName === x) {
                this.citySelectedItems.push(e.enName);
              }
            });
          });
        } else if (lang === 'ar') {
          res.map((item: City) => {
            this.cityDropdownList.push(item.arName);
          });
          res.forEach((e) => {
            arr.forEach((x) => {
              if (e.enName === x) {
                this.citySelectedItems.push(e.arName);
              }
            });
          });
        }
      });
    });
  }

  onItemSelect(item) {
    this.service.searchParams = this.getFilterUrl();
  }
  onDeSelect(item) {
    this.service.searchParams = this.getFilterUrl();
  }
  onSelectAll(items, val: string) {
    if (val === 'city') {
      this.citySelectedItems = items;
    } else if (val === 'status') {
      this.statusSelectedItems = items;
    }
    this.service.searchParams = this.getFilterUrl();
  }
  onDeSelectAll(items, val: string) {
    if (val === 'city') {
      this.citySelectedItems = items;
    } else if (val === 'status') {
      this.statusSelectedItems = items;
    }
    this.service.searchParams = this.getFilterUrl();
  }

  getFilterUrl() {
    return 'city=' + this.citySelectedItems.toString() + '&' + 'status=' + this.statusSelectedItems.toString();
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `id:'*${searchTerm.toLowerCase()}*' OR name:'*${searchTerm.toLowerCase()}*' OR mobileNo:'*${searchTerm.toLowerCase()}*' OR owner.firstName:'*${searchTerm.toLowerCase()}*' OR owner.email:'*${searchTerm.toLowerCase()}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity) {}
}
