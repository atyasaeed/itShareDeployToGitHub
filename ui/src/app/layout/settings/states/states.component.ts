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
  state: State;
  staties: State[] = new Array();
  constructor(
    service: StateService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private http: HttpClient
  ) {
    super(service, loadingService);
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
  }
  ngOnInit() {
    this.http.get('assets/state.json').subscribe((res: State[]) => {
      this.staties = res;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `arName:'*${searchTerm}*' `;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
}
