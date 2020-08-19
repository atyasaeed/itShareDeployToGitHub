import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
  @Input() heading: string;
  @Input() icon: string;
  @Input() breadCrumbs: any[];
  constructor() {}

  ngOnInit(): void {}
  leaf() {
    return this.breadCrumbs[this.breadCrumbs.length - 1].heading;
  }
}
