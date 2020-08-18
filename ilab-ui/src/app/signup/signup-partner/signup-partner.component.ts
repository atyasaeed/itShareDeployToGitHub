import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-signup-partner',
  templateUrl: './signup-partner.component.html',
  styleUrls: ['./signup-partner.component.scss'],
  animations: [routerTransition()],
})
export class SignupPartnerComponent implements OnInit {
  user: User;
  registrationForm: FormGroup;
  loading = false;
  dropdownList: Service[] = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService
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
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // currentPosition: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      website: [''],
      services: [''],
    });
  }

  // checkLanguage() {
  //   const element = document.querySelector('body');
  //   if (element.classList.contains('rtl')) {
  //     return true;
  //   }
  // }

  onSubmit() {
    if (this.registrationForm.invalid) {
      console.log(this.registrationForm.value);
      this.registrationForm.markAllAsTouched();
      return;
    }
    console.log(this.registrationForm.value);
    this.user = this.registrationForm.value;
    console.log(this.user);
    this.router.navigateByUrl('/login');

    this.userService.updateOrg(this.registrationForm.value).subscribe(
      (res) => {
        this.router.navigateByUrl('/login');
        this.alertservice.success(this.translate.instant('registeration.success'));
        // this.alertservice.success('please check your email');
      },
      (err) => {}
    );
  }
}
