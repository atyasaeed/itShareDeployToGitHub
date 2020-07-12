import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Service } from 'src/app/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class ServicesListService extends RestService<Service> {
  //constructor() {}
  //resource = 'hfhhf';
}
