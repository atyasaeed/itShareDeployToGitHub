import { Component, OnInit, VERSION, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';

import { AlertService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { CustomCaptchaService } from 'src/app/shared/services/captcha.service';
import { TdLoadingService } from '@covalent/core/loading';
//import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

@Component({
  selector: 'app-signup-activation',
  templateUrl: './signup-activation.component.html',
  styleUrls: ['./signup-activation.component.scss'],
  animations: [routerTransition()],
  // providers: [
  //   {
  //     provide: RECAPTCHA_LANGUAGE,
  //     useValue: 'en',
  //   },
  // ],
})
export class SignupActivationComponent implements OnInit {
  form: FormGroup;
  user = {} as User;
  loading = true;
  // public version = VERSION.full;
  emptyCaptcha = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private toastr: ToastrService,
    private captchaService: CustomCaptchaService,
    private cdref: ChangeDetectorRef,
    private loadingService: TdLoadingService
  ) {
    Object.assign(this.user, this.router.getCurrentNavigation().extras.state);
    console.log(this.user);
    if (!this.router.getCurrentNavigation().extras.state) {
      this.router.navigateByUrl('/home');
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit() {
    this.captchaService.captchaInit(this.emptyCaptcha);
    this.cdref.detectChanges();
  }

  createForm() {
    this.form = this.formBuilder.group({
      activationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }
  // public reactiveForm: FormGroup = new FormGroup({
  //   recaptchaReactive: new FormControl(null, Validators.required),
  // });
  //public recaptchaReactive = new FormControl(null, Validators.required);

  onSubmit() {
    this.loadingService.register('loading');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.loadingService.resolve('loading');
      return;
    }
    // to be remove
    console.log(this.user);
    if (this.user) {
      const formData: FormData = new FormData();

      const itemBlob = new Blob([JSON.stringify(this.user)], {
        type: 'application/json',
      });
      formData.append('user', itemBlob);
      const activationCode = new Blob([this.form.get('activationCode').value], {
        type: 'text/plain',
      });
      formData.append('activationCode', activationCode);
      this.userService.activate(formData).subscribe(
        (res: User) => {
          console.log(res);

          if (res.status == true) {
            if (res.roles.includes('ROLE_REGISTER_PRIVILEGE')) {
              this.user.roles = new Array();
              this.user.roles.concat('ROLE_REGISTER_PRIVILEGE');
              this.appStore.dispatch(new fromStore.UpdateAuthUser(this.user));
              this.router.navigate(['signup/partner'], {
                state: this.user,
              });
              this.loadingService.resolve('loading');
            } else {
              this.router.navigateByUrl('/login');
              this.toastr.success(this.translate.instant('registeration.success'));
              this.loadingService.resolve('loading');
            }
          } else {
            this.toastr.error(this.translate.instant('verificationCode.error.incorrect'));
            this.loadingService.resolve('loading');
          }
        },
        (err) => {
          this.loadingService.resolve('loading');

          console.log(err);
        }
      );
    }
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.userService.resendCode(this.user.email).subscribe((res) => {
      this.loading = false;

      console.log(res);
    });
  }
  resendCode() {
    this.loadingService.register('loading');
    console.log('resendcode');
    console.log('token = ' + window['captchaToken']);

    this.loading = true;
    console.log(this.user);
    // this.router.navigateByUrl('/signup/partner');

    this.userService.resendCode(this.user.username).subscribe((res) => {
      this.loading = true;
      this.loadingService.resolve('loading');

      this.alertservice.success(this.translate.instant('registeration.success.verify'));

      grecaptcha.reset();
      console.log(res);
    });
  }
  // test(event) {
  //   console.log(event);
  //   console.log('plaplapla');
  // }
}
