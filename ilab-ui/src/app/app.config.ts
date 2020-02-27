import { InjectionToken } from '@angular/core';

export interface IAppConfig {
  API_END_POINT: string;
  LOGIN_URL: string;
  LOGOUT_URL: string;
  REGISTER_URL: string;
  CHANGE_PASSWORD_URL: string;
  SAVE_PASSWORD_URL: string;
  RESET_PASSWORD_URL: string;
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
    return this.API_END_POINT + 'api/users';
  }
  public get CHANGE_PASSWORD_URL() {
    return this.API_END_POINT + 'api/users/changePassword';
  }
  public get RESET_PASSWORD_URL() {
    return this.API_END_POINT + 'api/users/resetPassword';
  }
  public get SAVE_PASSWORD_URL() {
    return this.API_END_POINT + 'api/users/savePassword';
  }

  public get ASSETS_URL() {
    return this.API_END_POINT + 'assets/images/';
  }
  public get FILE_URL() {
    return this.API_END_POINT + 'assets/files/';
  }
  public get CHECKOUT_URL() {
    return this.getResourceUrl('orders/checkout');
  }
  public getResourceUrl(resource) {
    return this.API_END_POINT + 'api/' + resource;
  }
}
class ProdAppConfig extends DefaultAppConfig {
  public API_END_POINT = 'http://localhost:8080/';
  //  public API_END_POINT = 'http://192.168.1.5:8080/';
  //  public API_END_POINT = 'http://192.168.1.201:8080/';
  // public API_END_POINT = '/';
}
class DevAppConfig extends DefaultAppConfig {
  public API_END_POINT = '/test/';
  public getResourceUrl(resource) {
    return this.API_END_POINT + resource;
  }
}

// export const prodConfig:IAppConfig=new DefaultAppConfig();
// prodConfig.API_END_POINT="http://localhost:8080";

export const devConfig: IAppConfig = new DevAppConfig();
export const prodConfig: IAppConfig = new ProdAppConfig();

export const APP_CONFIG = new InjectionToken<IAppConfig>('appconfig');
