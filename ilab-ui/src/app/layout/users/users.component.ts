import { routerTransition } from 'src/app/router.animations';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { UserService } from './user.service';
import { User } from 'src/app/shared/domain';
import { Observable } from 'rxjs';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [routerTransition()],
})
export class UsersComponent extends DefaultListComponent<User, UserService> {
  breadcrumbs = [{ heading: 'Users', icon: 'fa-tasks' }];

  private _searchTerm = '';

  constructor(service: UserService, private appStore: Store<fromStore.AppState>) {
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
  delete(entity) {
    // this.purge(entity).subscribe((result) => {
    //   this.appStore.dispatch(new fromStore.LoadInitState());
    // });
    this.service.delete(entity.id);
  }

  status(entity) {
    this.service.userState(entity.id);
    // entity.enabled = !entity.enabled;
  }
}
