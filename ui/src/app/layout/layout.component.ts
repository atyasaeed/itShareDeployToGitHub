import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  constructor(private router: Router, private cdr: ChangeDetectorRef, private appStore: Store<fromStore.AppState>) {}
  @ViewChild('header') header: ElementRef;
  @ViewChild('footer') footer: ElementRef;
  layoutComponentsMinHeight: number;

  ngOnInit() {}

  ngAfterViewInit() {
    this.calcMinHeight();
    this.router.events.subscribe((event) => {
      this.calcMinHeight();
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calcMinHeight();
  }

  calcMinHeight() {
    this.layoutComponentsMinHeight =
      this.header.nativeElement.getBoundingClientRect().height +
      this.footer.nativeElement.getBoundingClientRect().height;
    this.cdr.detectChanges();
  }
}
