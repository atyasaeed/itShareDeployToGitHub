import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/shared/domain/state.model';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { getLang } from 'src/app/store';
import { TdLoadingService } from '@covalent/core/loading';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { ReasonService } from 'src/app/shared/services/reason.service';
import { StateService } from 'src/app/shared/services/state.service';
import { routerTransition } from 'src/app/router.animations';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
  animations: [routerTransition()],
})
export class StatesComponent extends DefaultListComponent<State, StateService> implements OnInit {
  breadcrumbs = [{ heading: 'governorate', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  constructor(
    service: StateService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    super(service, loadingService);
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `arName:'*${searchTerm}*' OR enName:'*${searchTerm.toLowerCase()}*' `;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }

  delete(entity) {
    this.purge(entity).subscribe(
      (result) => {},
      (err) => {
        if (err.error.typeMessage === 'error.dataError') {
          this.toastr.error(this.translate.instant('delete.error'));
        } else {
          this.toastr.error(this.translate.instant(err.message));
        }
      }
    );
  }
}
