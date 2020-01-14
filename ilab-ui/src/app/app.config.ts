import { InjectionToken } from '@angular/core'

export interface IAppConfig{
    API_END_POINT:string;
    LOGIN_URL:string;
    LOGOUT_URL:string;
    REGISTER_URL:string;
    ASSETS_URL:string;
    getResourceUrl(resource:string):string;


}
class DefaultAppConfig implements IAppConfig{
    public API_END_POINT="/";
    public get LOGIN_URL(){return this.API_END_POINT+"login"}
    public get LOGOUT_URL(){return this.API_END_POINT+"logout"}
    public get REGISTER_URL(){return this.API_END_POINT+"api/users"}
    public get ASSETS_URL(){return this.API_END_POINT+"assets/images/"}
    public getResourceUrl(resource){
        return this.API_END_POINT+"api/"+resource;
    }
}
class ProdAppConfig extends DefaultAppConfig{
    public API_END_POINT="http://localhost:8080/";

}
class DevAppConfig extends DefaultAppConfig{
    public API_END_POINT="/test/";
    public getResourceUrl(resource){
        return this.API_END_POINT+resource;
    }


}

// export const prodConfig:IAppConfig=new DefaultAppConfig();
// prodConfig.API_END_POINT="http://localhost:8080";

export const devConfig:IAppConfig=new DevAppConfig();
export const prodConfig:IAppConfig=new ProdAppConfig();


export const APP_CONFIG=new InjectionToken<IAppConfig>("appconfig");
