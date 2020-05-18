import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../app.config';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { SortDirection } from '../directives/sortable.directive';
import { tap, debounceTime, switchMap, delay, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

// interface Query {
//   limit?: number;
//   order?: string;
//   sort?: string;
//   embed?: string;
//   expand?: string;
// }

interface SearchResult<T> {
  entities: T[];
  total: number;
}
interface State {
  page?: number;
  pageSize?: number;
  search?: string;
  sortColumn?: string;
  sortDirection?: SortDirection;
}
@Injectable({
  providedIn: 'root',
})
export class RestService<T> {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _model$ = new BehaviorSubject<T[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 10,
  };
  resource = '/';
  type: any;

  constructor(
    @Inject(HttpClient) private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig,
    auth: AuthenticationService
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._model$.next(result.entities);
        this._total$.next(result.total);
      });
  }
  get http() {
    return this.httpClient;
  }
  get appConfig() {
    return this.config;
  }
  get url() {
    return this.appConfig.getResourceUrl(this.resource);
  }

  // query(state?: State) {
  //   let url = this.url;
  //   if (state) {
  //     url += `?${this.toQueryString(state)}`;
  //   }

  //   return this.http.get<T>(url);
  // }

  get(id: string) {
    return this.http.get<T>(this.url + '/' + id);
  }

  create(body: any) {
    return this.http.post<T>(this.url, body).pipe(
      tap(
        (result) => {},
        (error) => {}
      )
    );
  }

  update(body: any) {
    return this.http.put<T>(this.url, body);
  }

  delete(id: string | number) {
    return this.http.delete<T>(this.url + '/' + id);
  }
  private _search(): Observable<SearchResult<T>> {
    const { sortColumn, sortDirection, pageSize, page, search } = this._state;

    let url = this.url + `/search?size=${pageSize}&page=${page - 1}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
      // url += `&search=${search}`;
    }
    if (sortColumn) {
      url += `&sort=${sortColumn},${sortDirection}`;
    }
    return this.http.get<any>(url).pipe(
      map((result) => {
        return { entities: result.content, total: result.totalElements };
      })
    );
  }
  get model$() {
    return this._model$.asObservable();
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
    return this._state.search;
  }

  set searchTerm(search: string) {
    this._set({ search });
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
  // private toQueryString(paramsObject) {
  //   return Object.keys(paramsObject)
  //     .map((key) => `_${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
  //     .join('&');
  // }
}
