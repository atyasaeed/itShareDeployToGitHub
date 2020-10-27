import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
  breadcrumbs = [{ heading: 'RFQs', icon: 'fa-tasks' }];
  constructor() {}

  ngOnInit(): void {}
}
