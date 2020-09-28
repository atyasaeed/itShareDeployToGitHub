import { Component, OnInit, ViewChildren, QueryList, Inject } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TdLoadingService } from '@covalent/core/loading';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Service } from 'src/app/shared/domain';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition()],
})
export class HomeComponent implements OnInit {
  //public sliders: Array<any> = [];
  services: Service[];
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>
  ) {
    // this.http.get(this.appConfig.SLIDER_URL).subscribe((res) => {
    //   this.sliders = res as any;
    // });
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      this.services = res;
    });
  }

  ngOnInit(): void {}
}
