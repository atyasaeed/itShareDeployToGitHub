import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { User, Service } from 'src/app/shared/domain';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { AlertService } from 'src/app/shared/services';

import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { City } from './city';
import { TdLoadingService } from '@covalent/core/loading';
import { Subject } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/shared/guard/can-deactivate-guard.service';
import { TdDialogService } from '@covalent/core/dialogs';
import { OrganizationService } from 'src/app/shared/services/organization.service';

@Component({
  selector: 'app-signup-partner',
  templateUrl: './signup-partner.component.html',
  styleUrls: ['./signup-partner.component.scss'],
  animations: [routerTransition()],
})
export class SignupPartnerComponent implements OnInit, CanComponentDeactivate {
  user: User;
  registrationForm: FormGroup;
  loading = false;
  dropdownList: Service[] = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  city: City = {} as City;
  cities: City[] = new Array();
  lang: string;
  formData: FormData = new FormData();
  canDeactivateValue: Subject<boolean> = new Subject<boolean>();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private orgservice: OrganizationService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef
  ) {
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      this.dropdownList = res;
    });

    this.http.get('assets/cities.json').subscribe((res: City[]) => {
      this.cities = res;
    });

    this.dropdownSettings = {
      idField: 'id',
      textField: 'name',
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {}
  onItemDeSelect(item) {}

  onSelectAll(items: any) {
    this.registrationForm.get('services').setValue(items);
  }
  onDeSelectAll(items: any) {
    this.registrationForm.get('services').setValue(items);
  }

  ngOnInit(): void {
    this.createForm();
    this.userService.get('').subscribe(
      (res) => {
        this.registrationForm.patchValue(res.defaultOrg);
      },
      (err) => {
        this.alertservice.error(this.translate.instant(err.message));
      }
    );
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      id: [''],
      created: [''],
      type: [''],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      // currentPosition: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      services: [null, [Validators.required]],
    });
  }
  onSubmit() {
    this.loading = true;
    this.loadingService.register('loading');
    if (this.registrationForm.invalid) {
      console.log(this.registrationForm.value);
      this.registrationForm.markAllAsTouched();
      this.loadingService.resolve('loading');
      this.loading = false;
      return;
    }
    const itemBlob = new Blob([JSON.stringify(this.registrationForm.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);

    this.orgservice.updateOrg(this.formData, this.registrationForm.get('id').value).subscribe(
      (res) => {
        this.registrationForm.markAsPristine();
        this.router.navigateByUrl('/login');
        this.loadingService.resolve('loading');
        this.alertservice.success(this.translate.instant('registeration.success'));

        // this.alertservice.success('please check your email');
      },
      (err) => {
        this.alertservice.error(this.translate.instant(err.message));
        this.loadingService.resolve('loading');
        this.loading = false;
      }
    );
  }

  canDeactivate() {
    if (this.registrationForm.dirty) {
      this._dialogService
        .openConfirm({
          message: this.translate.instant('deactivateModalMessage'),
          disableClose: true || false,
          viewContainerRef: this._viewContainerRef,
          title: this.translate.instant('areYouSure'),
          cancelButton: this.translate.instant('no'),
          acceptButton: this.translate.instant('yes'),
          width: '320px',
          panelClass: 'deactivate-modalbox',
        })
        .afterClosed()
        .subscribe((accept: boolean) => {
          if (accept) {
            this.canDeactivateValue.next(true);
          } else {
            this.canDeactivateValue.next(false);
          }
        });

      return this.canDeactivateValue;
    }

    return true;
  }
}
