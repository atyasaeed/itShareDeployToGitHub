import { InjectionToken } from '@angular/core'

export interface IAppConfig{
    API_END_POINT:string;
    LOGIN_URL:string;
    LOGOUT_URL:string;


}
class DefaultAppConfig implements IAppConfig{
    public API_END_POINT="/";
    public get LOGIN_URL(){return this.API_END_POINT+"login"}
    public get LOGOUT_URL(){return this.API_END_POINT+"login?logout"}
}
class ProdAppConfig extends DefaultAppConfig{
    public API_END_POINT="http://localhost:8080/";

}

// export const prodConfig:IAppConfig=new DefaultAppConfig();
// prodConfig.API_END_POINT="http://localhost:8080";

export const devConfig:IAppConfig=new DefaultAppConfig();
export const prodConfig:IAppConfig=new ProdAppConfig();


export const APP_CONFIG=new InjectionToken<IAppConfig>("appconfig");
