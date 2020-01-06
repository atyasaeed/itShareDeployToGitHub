import { Component, OnInit,Input } from '@angular/core';
import { LineItem } from 'src/app/domain';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.css']
})
export class LineItemComponent implements OnInit {

  @Input() lineItem : LineItem;

  constructor() { }

  ngOnInit() {
  }

}
