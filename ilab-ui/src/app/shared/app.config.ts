import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  FILE_SIZE: any;
  INIT_STATE_URL: string;
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
    return this.API_END_POINT + 'digital-assets/images/';
  }
  public get FILE_URL() {
    return this.API_END_POINT + 'digital-assets/files/';
  }
  public get CHECKOUT_URL() {
    return this.getResourceUrl('orders/checkout');
  }
  public get INIT_STATE_URL() {
    return this.getResourceUrl('utils/initState');
  }
  public get FILE_SIZE() {
    return 5000000;
  }
  public getResourceUrl(resource) {
    return this.API_END_POINT + 'api/' + resource;
  }
}
class ProdAppConfig extends DefaultAppConfig {
  public API_END_POINT = environment.baseUrl;
}
class DevAppConfig extends DefaultAppConfig {}

export const devConfig: IAppConfig = new DevAppConfig();
export const prodConfig: IAppConfig = new ProdAppConfig();

export const APP_CONFIG = new InjectionToken<IAppConfig>('appconfig', {
  providedIn: 'root',
  factory: () => prodConfig,
});