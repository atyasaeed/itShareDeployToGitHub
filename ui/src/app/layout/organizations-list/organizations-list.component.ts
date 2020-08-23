import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { TdLoadingService } from '@covalent/core/loading';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { Organization } from 'src/app/shared/domain/organization.model';

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
  constructor(service: OrganizationService, loadingService: TdLoadingService) {
    super(service, loadingService);
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `name:'*${searchTerm}*' `;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
  delete(entity) {}
}
