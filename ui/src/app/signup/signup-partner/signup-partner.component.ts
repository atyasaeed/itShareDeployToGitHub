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
import { City, cities } from './city';
import { Subject } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/shared/guard/can-deactivate-guard.service';
import { TdDialogService } from '@covalent/core/dialogs';

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
  cities: City[] = cities;
  canDeactivateValue: Subject<boolean> = new Subject<boolean>();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef
  ) {
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      console.log(res);
      this.dropdownList = res;
    });
    // this.dropdownList = [
    //   'PENDING',
    //   'QUOTED',
    //   'QUOTE_ACCEPTED',
    //   'IN_PROGRESS',
    //   'FINISHED',
    //   'DELIVERED',
    //   'CANCELLED',
    //   'QUOTE_REJECTED',
    // ];

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
  onItemSelect(item: any) {
    // console.log(item);
    // this.selectedItems.push(item);
    // console.log(this.selectedItems);
    // this.registrationForm.get('services').setValue(this.selectedItems);
    console.log(this.registrationForm.get('services').value);
  }
  onItemDeSelect(item) {
    // console.log(item);
    // console.log(this.selectedItems);
    console.log(this.registrationForm.get('services').value);
  }

  onSelectAll(items: any) {
    // console.log(items);
    console.log(items);
    this.registrationForm.get('services').setValue(items);
    console.log(this.registrationForm.get('services').value);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
    // console.log(items.toString());
    this.registrationForm.get('services').setValue(items);

    console.log(this.registrationForm.get('services').value);
  }

  ngOnInit(): void {
    this.createForm();
    // this.registrationForm.get('services').patchValue([]);
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      // currentPosition: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      services: [null],
    });
  }

  // checkLanguage() {
  //   const element = document.querySelector('body');
  //   if (element.classList.contains('rtl')) {
  //     return true;
  //   }
  // }

  onSubmit() {
    this.loading = true;
    if (this.registrationForm.invalid) {
      console.log(this.registrationForm.value);
      this.registrationForm.markAllAsTouched();
      this.loading = false;
      return;
    }

    this.userService.updateOrg(this.registrationForm.value).subscribe(
      (res) => {
        this.registrationForm.markAsPristine();
        this.router.navigateByUrl('/login');
        this.alertservice.success(this.translate.instant('registeration.success'));

        // this.alertservice.success('please check your email');
      },
      (err) => {
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
