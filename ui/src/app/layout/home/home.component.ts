import { Component, OnInit, ViewChildren, QueryList, Inject } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { HttpClient } from '@angular/common/http';
import { TdLoadingService } from '@covalent/core/loading';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { Service } from 'src/app/shared/domain';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition()],
})
export class HomeComponent implements OnInit {
  services: Service[];
  private fragment: string;
  lang: string;
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService,
    private appStore: Store<fromStore.AppState>,
    private route: ActivatedRoute
  ) {
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      this.services = res;
    });
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      this.fragment = fragment;
      console.log(this.fragment);
    });
  }
  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) {}
  }
}
