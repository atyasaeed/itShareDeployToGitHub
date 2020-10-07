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
  city: City;
  cities: City[] = new Array();
  constructor(
    service: CityService,
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
    this.http.get('assets/city.json').subscribe((res: City[]) => {
      this.cities = res;
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
