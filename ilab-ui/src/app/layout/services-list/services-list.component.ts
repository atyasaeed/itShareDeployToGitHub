import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Service } from 'src/app/shared/domain';
import { ServicesListService } from './services-list.service';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  animations: [routerTransition()],
})
export class ServicesListComponent extends DefaultListComponent<Service, ServicesListService> implements OnInit {
  breadcrumbs = [{ heading: 'Services', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(service: ServicesListService) {
    super(service);
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
