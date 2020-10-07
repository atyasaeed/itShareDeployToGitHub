import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { Store, State } from '@ngrx/store';
import { City } from 'src/app/shared/domain/city.model';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { CityService } from 'src/app/shared/services/city.service';
import { getLang } from 'src/app/store';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
  animations: [routerTransition()],
})
export class CitiesComponent extends DefaultListComponent<City, CityService> implements OnInit {
  breadcrumbs = [{ heading: 'city', icon: 'fa-tasks' }];
  private _searchTerm = '';
  lang: string;
  stateId;
  constructor(
    service: CityService,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService,
    private router: Router
  ) {
    super(service, loadingService);
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
    console.log(this.router.getCurrentNavigation().extras.state);
    this.stateId = this.router.getCurrentNavigation().extras.state;
    if (this.stateId) {
      this.service.searchParams = `stateId=${this.stateId}`;
    }
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `arName:'*${searchTerm}*' OR enName:'*${searchTerm.toLowerCase()}*'OR state.id:'*${searchTerm.toLowerCase()}*' `;
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
        }
      }
    );
  }
}
