import { Observable } from 'rxjs';
import { ViewChildren, QueryList, OnInit } from '@angular/core';
import { SortableHeaderDirective, SortEvent } from '../directives/sortable.directive';
import { RestService } from '../services';
import { tap, first, share } from 'rxjs/operators';
import { Entity } from '../domain';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

export class DefaultListComponent<T extends Entity, K extends RestService<T>> implements OnInit {
  entities$: Observable<T[]>;
  key: string = 'loading';
  total$: Observable<number>;
  service: K;
  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;
  constructor(
    service: K,
    protected loadingService: TdLoadingService,
    protected translate: TranslateService,
    protected toastr: ToastrService
  ) {
    this.service = service;
  }
  ngOnInit(): void {
    this.entities$ = this.service.model$;
    this.total$ = this.service.total$;
    this.service.searchTerm = '';
    this.loadingService.register(this.key);
    this.service.loading$.subscribe(
      (res) => {
        if (!res) {
          this.loadingService.resolve(this.key);
        }
      },
      (err) => {
        this.loadingService.resolve(this.key);
        this.toastr.error(this.translate.instant(err));
      }
    );
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
      tap(
        (result) => {
          this.service.page = this.service.page;
        },
        (err) => {
          this.loadingService.resolve(this.key);
          this.toastr.error(this.translate.instant(err));
        }
      )
    );
  }
}
