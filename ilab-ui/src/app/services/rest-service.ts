import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../app.config';

interface Query {
  limit?: number;
  order?: string;
  sort?: string;
  embed?: string;
  expand?: string;
}

export class RestService {
  resource: string = '/';
  type: any;

  constructor(@Inject(HttpClient) private _http: HttpClient,@Inject(APP_CONFIG) private _appConfig:IAppConfig) { }
  get http(){
    return this._http;
  }
  get appConfig(){
    return this._appConfig;
  }
  get url() {
    return this.appConfig.getResourceUrl( this.resource);
  }

  query<T>(query?: Query) {
    let url = this.url;
    if (query) {
      url += `?${this.toQueryString(query)}`;
    }

    return this.http.get<T>(url);
  }

  get<T>(id: string) {
    return this.http.get<T>(this.url + '/' + id);
  }

  create<T>(body: any) {
    return this.http.post<T>(this.url, body);
  }

  update<T>(id: string, body: any) {
    return this.http.put<T>(this.url + '/' + id , body);
  }

  delete<T>(id: number) {
    return this.http.delete<T>(this.url + '/' + id);
  }

  private toQueryString(paramsObject) {
    return Object
      .keys(paramsObject)
      .map(key => `_${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
      .join('&');
  }
}