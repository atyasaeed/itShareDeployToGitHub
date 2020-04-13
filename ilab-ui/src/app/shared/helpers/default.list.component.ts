import { Observable } from 'rxjs';
import { ViewChildren, QueryList, OnInit } from '@angular/core';
import { SortableHeaderDirective, SortEvent } from '../directives/sortable.directive';
import { RestService } from '../services';
import { tap, first, share } from 'rxjs/operators';
import { Entity } from '../domain';

export class DefaultListComponent<T extends Entity, K extends RestService<T>> implements OnInit {
  entities$: Observable<T[]>;
  total$: Observable<number>;
  service: K;
  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;
  constructor(service: K) {
    this.service = service;
  }
  ngOnInit(): void {
    this.entities$ = this.service.model$;
    this.total$ = this.service.total$;
    this.service.searchTerm = '';
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  purge(entity: T) {
    return this.service.delete(entity.id).pipe(
      tap((result) => {
        this.service.page = this.service.page;
      })
    );
  }
}
