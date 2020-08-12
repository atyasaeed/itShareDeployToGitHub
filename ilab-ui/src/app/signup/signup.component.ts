import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Country, COUNTRIES } from './countries';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../shared/services';
import { User } from '../shared/domain';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { UserService } from '../shared/services/user.service';
import { CustomCaptchaService } from '../shared/services/captcha.service';
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
  emptyCaptcha = true;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private captchaService: CustomCaptchaService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.snapshot.queryParams;
    // console.log(this.router.getCurrentNavigation().extras.state);
    if (this.route.snapshot.queryParams['partner']) {
    } else {
    }
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.createForm();
  }

  ngAfterViewInit() {
    //this.changeRecaptchaLanguage();
    this.captchaService.captchaInit(this.emptyCaptcha);
    this.cdref.detectChanges();
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
      // this.user = this.registrationForm.value;
      // this.appStore.dispatch(new fromStore.UpdateAuthUser(this.user));
      // this.router.navigate(['signup/activation'], {
      //   state: this.user,
      // });
      return;
    }

    this.user = this.registrationForm.value;
    console.log(this.user);

    this.userService.register(this.user).subscribe(
      (res) => {
        if (this.route.snapshot.queryParams['partner']) {
          // this.router.navigate(['signup/activation']
          this.router.navigateByUrl('signup/activation');
        } else {
          this.router.navigateByUrl('/login');
          this.alertservice.success(this.translate.instant('registeration.success'));
        }

        // this.alertservice.success('please check your email');
      },
      (err) => {}
    );
  }
}
