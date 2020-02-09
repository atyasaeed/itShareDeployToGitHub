import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';

interface Query {
  limit?: number;
  order?: string;
  sort?: string;
  embed?: string;
  expand?: string;
}
export class RestService {
  resource = '/';
  type: any;

  constructor(@Inject(HttpClient) private _http: HttpClient, @Inject(APP_CONFIG) private _appConfig: IAppConfig) {}

  get http() {
    return this._http;
  }

  get appConfig() {
    return this._appConfig;
  }
  get url() {
    return this.appConfig.getResourceUrl(this.resource);
  }
  query<T>(query?: Query) {
    let url = this.url;
    if (query) {
      url += `?${this.toQueryString(query)}`;
    }

    return this.http.get<T>(url);
  }

  get<T>(id: string) {
    return this.http.get(this.url + '/' + id);
  }

  create<T>(body: any) {
    return this.http.post(this.url, body);
  }
  update<T>(id: string, body: any) {
    return this.http.put(this.url + '/' + id, body);
  }
  delet(id: string) {
    return this.http.delete(this.url + '/' + id);
  }
  private toQueryString(paramsObject) {
    return Object.keys(paramsObject)
      .map(key => `_${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
      .join('&');
  }
}
