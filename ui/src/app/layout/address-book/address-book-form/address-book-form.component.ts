import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { AddressBook } from 'src/app/shared/domain/address-book.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { AddressBookService } from 'src/app/shared/services/address-book.service';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { routerTransition } from 'src/app/router.animations';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../../../shared/domain/state.model';
import { City } from '../../../shared/domain/city.model';
import { CityService } from 'src/app/shared/services/city.service';
import { StateService } from 'src/app/shared/services/state.service';
@Component({
  selector: 'app-address-book-form',
  templateUrl: './address-book-form.component.html',
  styleUrls: ['./address-book-form.component.scss'],
  animations: [routerTransition()],
  providers: [StateService, CityService],
})
export class AddressBookFormComponent extends DefaultFormComponent<AddressBook, AddressBookService> implements OnInit {
  breadcrumbs = [{ heading: this.translate.instant('addressBook'), link: '/address-book' }, { heading: 'create' }];
  states: State[];
  cities: City[];
  constructor(
    private translate: TranslateService,
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    route: ActivatedRoute,
    router: Router,
    service: AddressBookService,
    @Inject(APP_CONFIG) private appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>,
    private http: HttpClient,
    private cityService: CityService,
    private stateService: StateService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      lineOne: ['', [Validators.required, Validators.minLength(2)]],
      lineTwo: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.pattern(/(?<=\s|^)\d+(?=\s|$)/)]],
    });
    //this.states$ = this.http.get<State[]>('assets/state.json');
  }

  ngOnInit(): void {
    this.stateService.pageSize = 30;
    this.stateService.searchTerm = '';
    this.stateService.model$.subscribe((res) => {
      this.states = res;
    });
  }

  stateChanged(e) {
    this.cityService.searchTerm = `state.id:'${e.target.value}'`;
    this.cityService.model$.subscribe((res) => {
      this.cities = res;
    });
  }

  onCreate(): void {}
  onUpdate(): void {
    this.breadcrumbs.splice(1, 1);
    this.breadcrumbs.push({ heading: 'edit' });
  }
  cancel(): void {
    this.router.navigateByUrl(this.breadcrumbs[0].link);
  }
}
