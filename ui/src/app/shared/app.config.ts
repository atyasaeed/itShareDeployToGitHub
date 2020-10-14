import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Service, LineItem } from './domain';
export interface IAppConfig {
  API_END_POINT: string;
  LOGIN_URL: string;
  LOGOUT_URL: string;
  REGISTER_URL: string;
  CHANGE_PASSWORD_URL: string;
  SAVE_PASSWORD_URL: string;
  RESET_PASSWORD_URL: string;
  //ASSETS_URL: string;
  FILE_URL: string;
  FILE_URL_ADMIN: string;
  CHECKOUT_URL: string;
  FILE_SIZE: any;
  INIT_STATE_URL: string;
  CHANGE_LANG_URL: string;
  getResourceUrl(resource: string): string;
  AWSUrl: string;
  SLIDER_URL: string;
  serviceImage(entity: Service): string;
}
class DefaultAppConfig implements IAppConfig {
  public API_END_POINT = '/';
  public AWSUrl = 'https://s3.amazonaws.com/prod.fabrihub.net/';
  public SLIDER_URL = 'https://s3.amazonaws.com/fabrihub.net/static-assets/sliders.json';

  public get LOGIN_URL() {
    return this.API_END_POINT + 'api/login';
  }
  public get LOGOUT_URL() {
    return this.API_END_POINT + 'api/logout';
  }
  public get REGISTER_URL() {
    return this.API_END_POINT + 'api/user';
  }
  public get CHANGE_PASSWORD_URL() {
    return this.API_END_POINT + 'api/user/changePassword';
  }
  public get RESET_PASSWORD_URL() {
    return this.API_END_POINT + 'api/user/resetPassword';
  }
  public get SAVE_PASSWORD_URL() {
    return this.API_END_POINT + 'api/user/savePassword';
  }
  public get CHANGE_LANG_URL() {
    return this.getResourceUrl('utils/lang');
  }
  // public get ASSETS_URL() {
  //   return this.API_END_POINT + 'digital-assets/images/';
  // }
  public get FILE_URL() {
    return this.API_END_POINT + 'api/digital-assets/files/';
  }
  public get FILE_URL_ADMIN() {
    return this.API_END_POINT + 'api/digital-assets/files/admin/';
  }
  public get CHECKOUT_URL() {
    return this.getResourceUrl('cart/checkout');
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
  public serviceImage(entity: Service) {
    return this.AWSUrl + 'services/' + entity.id + '/' + entity.image;
  }
}
class ProdAppConfig extends DefaultAppConfig {
  public API_END_POINT = environment.baseUrl;
  public AWSUrl = environment.AWSUrl;
}
class DevAppConfig extends DefaultAppConfig {}

export const devConfig: IAppConfig = new DevAppConfig();
export const prodConfig: IAppConfig = new ProdAppConfig();

export const APP_CONFIG = new InjectionToken<IAppConfig>('appconfig', {
  providedIn: 'root',
  factory: () => prodConfig,
});
