import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/shared/domain';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { AlertService } from 'src/app/shared/services';

import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';

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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      currentPosition: ['', [Validators.required]],
      // mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      governorate: ['', [Validators.required]],
      address: ['', [Validators.required]],
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

    this.user = this.registrationForm.value;
    console.log(this.user);

    this.userService.register(this.user).subscribe(
      (res) => {
        this.router.navigateByUrl('/login');
        this.alertservice.success(this.translate.instant('registeration.success'));
        // this.alertservice.success('please check your email');
      },
      (err) => {}
    );
  }
}
