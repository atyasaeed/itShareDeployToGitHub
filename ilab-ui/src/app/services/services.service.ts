import { Injectable, Inject } from '@angular/core';
import { RestService } from './rest-service';
import { APP_CONFIG, IAppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ServicesService extends RestService {
  resource:string="services";
  
}
