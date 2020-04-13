import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { UserService } from './user.service';
import { User } from 'src/app/shared/domain';
import { Observable } from 'rxjs';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends DefaultListComponent<User, UserService> {
  private _searchTerm = '';

  constructor(service: UserService) {
    super(service);
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `email:'*${searchTerm}*' OR username:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
}
