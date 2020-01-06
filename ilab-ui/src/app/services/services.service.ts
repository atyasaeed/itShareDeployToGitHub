import { Injectable } from '@angular/core';
import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService extends RestService {
  resource:string="/services";
}
