
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject, Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, debounceTime, switchMap, delay, map } from 'rxjs/operators';
import { Service, User } from 'src/app/domain';
import { SortDirection } from 'src/app/helpers/sortable.directive';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';


interface SearchResult {
  services: Service[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}
@Injectable({
  providedIn: 'root'
})
export class ServicesItemService  {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _service$ = new BehaviorSubject<Service[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };
  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: IAppConfig) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe(result => {
        this._service$.next(result.services);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get service$() {
    return this._service$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  set page(page: number) {
    this._set({ page });
  }
  get pageSize() {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    let url = this.appConfig.API_END_POINT+`api/services/search?size=${pageSize}&page=${page - 1}`;
    if (searchTerm) {
      url += `&search=name:*${searchTerm}* OR description:*${searchTerm}*`;
    }
    return this.http.get<any>(url).pipe(
      map(result => {
        return { services: result.content, total: result.totalElements };
      })
    );

}

}
function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(users: User[], column: string, direction: string): User[] {
  if (direction === '') {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(user: User, term: string) {
  return (
    user.username.toLowerCase().includes(term.toLowerCase()) ||
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term)
  );

}

