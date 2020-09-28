import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  collapsedSideBar: boolean;
  loadingRouteConfig: boolean;
  @ViewChild('header') header: ElementRef;
  @ViewChild('footer') footer: ElementRef;
  layoutComponentsMinHeight: number;
  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

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
