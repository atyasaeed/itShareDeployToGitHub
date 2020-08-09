import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Country, COUNTRIES } from './countries';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../shared/services';
import { User } from '../shared/domain';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { UserService } from '../shared/services/user.service';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()],
})
export class SignupComponent implements OnInit {
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword: ['', [Validators.required]],
      recaptchaReactive: ['', Validators.required],
    });
  }

  checkLanguage() {
    const element = document.querySelector('body');
    if (element.classList.contains('rtl')) {
      return true;
    }
  }

  onChange(value) {
    if (value !== 'Egypt') {
      this.registrationForm.get('idNumber').setValidators(null);
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.validateAllFormFields(this.registrationForm);
      /* activation*/
      this.user = this.registrationForm.value;
      this.appStore.dispatch(new fromStore.UpdateAuthUser(this.user));
      this.router.navigate(['signup/activation'], {
        state: this.user,
      });
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

  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach((field) => {
      // {2}
      const control = formGroup.get(field); // {3}
      if (control instanceof FormControl) {
        // {4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }
}
