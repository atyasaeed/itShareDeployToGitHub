import { Service } from './../domain/service.model';
import { Injectable, Inject } from '@angular/core';
import { RestService } from './rest-service';
import { APP_CONFIG, IAppConfig } from '../app.config';
import { User } from '../domain';
import { BehaviorSubject, Subject, Observable, observable } from 'rxjs';
import { SortDirection } from '../helpers/sortable.directive';
import { HttpClient } from '@angular/common/http';
import { tap, debounceTime, switchMap, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends RestService {
  resource: string = 'services';
}
