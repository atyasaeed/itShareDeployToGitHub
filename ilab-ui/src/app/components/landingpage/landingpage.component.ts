import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Service } from 'src/app/domain/service.model';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/helpers/sortable.directive';
import { ServicesItemService } from '../service-item/servicesitem.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  services$: Observable<Service[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public serviceitem: ServicesItemService ) {
    this.services$ =serviceitem.service$;
    this.total$ = serviceitem.total$;
  }


  ngOnInit() { }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.serviceitem.sortColumn = column;
    this.serviceitem.sortDirection = direction;
  }
}
