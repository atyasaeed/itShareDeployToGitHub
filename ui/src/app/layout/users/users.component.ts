import { routerTransition } from 'src/app/router.animations';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
// import { UserService } from './user.service';
import { User } from 'src/app/shared/domain';
//import { Observable } from 'rxjs';
//import { SortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { TdLoadingService } from '@covalent/core/loading';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [routerTransition()],
})
export class UsersComponent extends DefaultListComponent<User, UserService> {
  breadcrumbs = [{ heading: 'Users', icon: 'fa-tasks' }];
  lang: string;
  private _searchTerm = '';

  constructor(
    service: UserService,
    private appStore: Store<fromStore.AppState>,
    loadingService: TdLoadingService,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(service, loadingService, translate, toastr);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
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
    this.service.delete(entity.id);
  }

  status(entity) {
    this.service.userState(entity.id);
  }
}
