import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { Service } from 'src/app/shared/domain';
@Injectable({
  providedIn: 'root',
})
export class HomeService extends RestService<Service> {
  resource = 'services';
}
