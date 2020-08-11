import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Country, COUNTRIES } from './countries';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../shared/services';
import { User } from '../shared/domain';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { UserService } from '../shared/services/user.service';
// import {
//   RECAPTCHA_LANGUAGE,
//   RECAPTCHA_SETTINGS,
//   RecaptchaSettings,
//   ReCaptchaV3Service,
//   OnExecuteData,
// } from 'ng-recaptcha';

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
  disableCaptcha;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit() {
    this.changeRecaptchaLanguage();
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
    if (!this.registrationForm.valid) {
      // this.validateAllFormFields(this.registrationForm);
      this.registrationForm.markAllAsTouched();
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

  changeRecaptchaLanguage() {
    if (document.getElementById('captchaSubmit') != null) {
      (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled = true;
      this.disableCaptcha = (<HTMLInputElement>document.getElementById('captchaSubmit')).disabled;
      this.cdref.detectChanges();
    }
    this.appStore.select(fromStore.getLang).subscribe((res) => {
      if (document.querySelector('.g-recaptcha') != null) {
        document.querySelector('.g-recaptcha').innerHTML = '';
        if (document.querySelector('.captchaSection')) {
          document.querySelector('.captchaSection').innerHTML = '';
        } else {
          var captchaSection = document.createElement('div');
          captchaSection.className = 'captchaSection';
          document.querySelector('head').appendChild(captchaSection);
        }
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?hl=' + res;
        script.async = true;
        script.defer = true;
        var script2 = document.createElement('script');
        script2.innerHTML = `
          var successCaptcha = function(e){
            console.log(e);
            document.getElementById('captchaSubmit').disabled = false;
          }
          `;

        document.querySelector('.captchaSection').appendChild(script);
        document.querySelector('.captchaSection').appendChild(script2);
      }
    });
  }
}
