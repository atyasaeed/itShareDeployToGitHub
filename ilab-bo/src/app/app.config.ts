import { InjectionToken } from '@angular/core';

export interface IAppConfig {
  API_END_POINT: string;
  LOGIN_URL: string;
  LOGOUT_URL: string;
  REGISTER_URL: string;
  ASSETS_URL: string;
  FILE_URL: string;
  CHECKOUT_URL: string;
  getResourceUrl(resource: string): string;
}

class DefaultAppConfig implements IAppConfig {
  public API_END_POINT = '/';
  public get LOGIN_URL() {
    return this.API_END_POINT + 'login';
  }
  public get LOGOUT_URL() {
    return this.API_END_POINT + 'logout';
  }
  public get REGISTER_URL() {
    return this.API_END_POINT + 'register';
  }
  public get ASSETS_URL() {
    return this.API_END_POINT + 'assets/images/';
  }
  public get FILE_URL() {
    return this.API_END_POINT + 'assets/files/';
  }
  public get CHECKOUT_URL() {
    return this.API_END_POINT + 'orders/checkout';
  }
  public getResourceUrl(resource) {
    return this.API_END_POINT + 'api/' + resource;
  }
}

class ProdAppConfig extends DefaultAppConfig {
  // public API_END_POINT = 'http://localhost:8080/';
  // public API_END_POINT = 'http://192.168.1.5:8080/';
  public API_END_POINT = 'http://172.16.201.250:8080/';
}
class DevAppConfig extends DefaultAppConfig {
  public API_END_POINT = '/test/';
  public getResourceUrl(resource) {
    return this.API_END_POINT + resource;
  }
}
export const devConfig: IAppConfig = new DevAppConfig();
export const prodConfig: IAppConfig = new ProdAppConfig();

export const APP_CONFIG = new InjectionToken<IAppConfig>('appconfig');
