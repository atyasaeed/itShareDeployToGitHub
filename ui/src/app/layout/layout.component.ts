import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { User } from '../shared/domain';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  collapsedSideBar: boolean;
  loadingRouteConfig: boolean;
  user: User;
  constructor(private router: Router, private appStore: Store<fromStore.AppState>) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        //console.log('start');
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        //console.log('end');
        this.loadingRouteConfig = false;
      }
    });

    this.appStore.select(fromStore.getAuthUser).subscribe((res) => {
      this.user = res;
    });
  }

  receiveCollapsed($event) {
    this.collapsedSideBar = $event;
  }
}
