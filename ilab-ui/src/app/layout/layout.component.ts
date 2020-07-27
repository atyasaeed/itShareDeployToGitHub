import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  collapsedSideBar: boolean;
  loadingRouteConfig: boolean;
  constructor(private router: Router) {}

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
  }

  receiveCollapsed($event) {
    this.collapsedSideBar = $event;
  }
}
