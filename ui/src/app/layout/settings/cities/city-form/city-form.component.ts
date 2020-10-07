import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { City } from 'src/app/shared/domain/city.model';
import { State } from 'src/app/shared/domain/state.model';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { CityService } from 'src/app/shared/services/city.service';
import { StateService } from 'src/app/shared/services/state.service';
import * as fromStore from 'src/app/store';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.scss'],
  animations: [routerTransition()],
})
export class CityFormComponent extends DefaultFormComponent<City, CityService> implements OnInit {
  breadcrumbs = [
    { heading: 'city', icon: 'fa-tasks', link: '/settings/city' },
    { heading: 'city-Details', icon: 'fa-tasks' },
  ];
  lang: string;
  staties: State[] = new Array();
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: CityService,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    private stateService: StateService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.form = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      state: this.formBuilder.group({
        id: ['', Validators.required],
      }),
    });
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
    this.stateService.searchTerm = '';
    this.stateService.model$.subscribe((res: State[]) => {
      this.staties = res;
    });
  }

  onCreate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  onUpdate(): void {
    // this.breadcrumbs.push({ heading: 'User', icon: 'fa-tasks', link: null });
  }
  cancel(): void {
    this.router.navigateByUrl('/settings/city');
  }
  onSave() {
    this.appStore.dispatch(new fromStore.LoadInitState());
    console.log(this.form.value);
  }

  onDelete() {
    this.appStore.dispatch(new fromStore.LoadInitState());
  }
}
