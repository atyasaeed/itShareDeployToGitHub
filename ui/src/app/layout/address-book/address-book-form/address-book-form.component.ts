import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'src/app/shared/domain/address.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { AddressBookService } from 'src/app/shared/services/address-book.service';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { routerTransition } from 'src/app/router.animations';
import { HttpClient } from '@angular/common/http';
import { State } from '../../../shared/domain/state.model';
import { City } from '../../../shared/domain/city.model';
import { CityService } from 'src/app/shared/services/city.service';
import { StateService } from 'src/app/shared/services/state.service';
import { map } from 'rxjs/operators';
import { getLang } from 'src/app/store';
@Component({
  selector: 'app-address-book-form',
  templateUrl: './address-book-form.component.html',
  styleUrls: ['./address-book-form.component.scss'],
  animations: [routerTransition()],
  providers: [StateService, CityService],
})
export class AddressBookFormComponent extends DefaultFormComponent<Address, AddressBookService> implements OnInit {
  breadcrumbs = [{ heading: this.translate.instant('addressBook'), link: '/address-book' }, { heading: 'create' }];
  states: State[];
  cities: City[];
  lang: string;
  routeAfterSave: string;
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
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      lineOne: ['', [Validators.required, Validators.minLength(2)]],
      lineTwo: ['', [Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      phoneNo: ['', [Validators.required, Validators.minLength(11), Validators.pattern(/(?<=\s|^)\d+(?=\s|$)/)]],
    });
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
    });
    this.stateService.pageSize = 25;
    this.stateService.searchTerm = '';
    this.stateService.model$.subscribe(
      (res) => {
        this.states = res;
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
    this.cityService.pageSize = 25;
    this.cityService.model$.subscribe(
      (res) => {
        this.cities = res;
        this.loadingService.resolve(this.key);
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.routeAfterSave = this.router.getCurrentNavigation()?.extras.state.fromRoute;
    }
  }

  ngOnInit(): void {
    this.loadingService.register(this.key);
    this.route.params.pipe(map((params: Params) => params.entityId)).subscribe(
      (entityId) => {
        if (entityId) {
          this.onUpdate();
          this.service.get(entityId).subscribe(
            (entity) => {
              this.cityService.searchParams = `stateId=${entity.city.state.id}`;
              this.cityService.searchTerm = `id:'*${entity.city.id}*'`;
              this.form.patchValue(entity);
              this.form.controls.state.setValue(entity.city.state.id);
              this.form.controls.city.setValue(entity.city.id);
              this.entity = entity;
              this.loadingService.resolve(this.key);
            },
            (err) => {
              this.loadingService.resolve(this.key);
            }
          );
        } else {
          this.onCreate();
          this.entity = {} as Address;
          this.entity.city = {} as City;
          this.entity.city.state = {} as State;
          this.loadingService.resolve(this.key);
        }
      },
      (err) => {
        this.loadingService.resolve(this.key);
      }
    );
  }

  stateChanged(state: State) {
    this.loadingService.register(this.key);
    this.cityService.searchParams = `stateId=${state.id}`;
    this.form.controls.city.setValue('');
    this.form.controls.city.markAsUntouched();
  }

  stateFilter(e) {
    if (e.term.toLowerCase()) {
      if (this.lang === 'en') {
        this.stateService.searchTerm = `enName:'*${e.term.toLowerCase()}*'`;
      } else {
        this.stateService.searchTerm = `arName:'*${e.term.toLowerCase()}*'`;
      }
    } else {
      this.stateService.searchTerm = '';
    }
  }

  allStates() {
    this.loadingService.register(this.key);
    this.stateService.searchTerm = '';
  }

  allCities() {
    this.loadingService.register(this.key);
    this.cityService.searchTerm = '';
    this.cityService.searchParams = `stateId=${this.form.controls.state.value}`;
  }

  cityFilter(e) {
    if (e.term.toLowerCase()) {
      if (this.lang === 'en') {
        this.cityService.searchTerm = `enName:'*${e.term.toLowerCase()}*'`;
      } else {
        this.cityService.searchTerm = `arName:'*${e.term.toLowerCase()}*'`;
      }
      this.cityService.searchParams = `stateId=${this.form.controls.state.value}`;
    } else {
      this.cityService.searchTerm = '';
      this.cityService.searchParams = `stateId=${this.form.controls.state.value}`;
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.loadingService.register(this.key);
      this.entity.name = this.form.controls.name.value;
      this.entity.lineOne = this.form.controls.lineOne.value;
      this.entity.lineTwo = this.form.controls.lineTwo.value;
      this.entity.phoneNo = this.form.controls.phoneNo.value;
      this.entity.contactName = this.form.controls.contactName.value;
      this.entity.city.id = this.form.controls.city.value;
      this.entity.city.state.id = this.form.controls.state.value;
      if (this.entity.id) {
        this.service.update(this.entity).subscribe(
          (response) => {
            this.onSave();
            this.loadingService.resolve(this.key);
          },
          (err) => {
            this.loadingService.resolve(this.key);
          }
        );
      } else {
        this.service.create(this.entity).subscribe(
          (response) => {
            this.onSave();
            this.loadingService.resolve(this.key);
          },
          (err) => {
            this.loadingService.resolve(this.key);
          }
        );
      }
    }
  }
  onSave() {
    if (this.routeAfterSave) {
      if (this.routeAfterSave === '/shopping-cart') {
        this.router.navigate([this.routeAfterSave], { state: { fromRoute: '/address-book-form' } });
      } else {
        this.router.navigateByUrl(this.routeAfterSave);
      }
    } else {
      this.cancel();
    }
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
