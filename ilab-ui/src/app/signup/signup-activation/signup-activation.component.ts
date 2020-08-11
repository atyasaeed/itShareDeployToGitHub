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
  public version = VERSION.full;
  disableCaptcha;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private toastr: ToastrService,
    private cdref: ChangeDetectorRef
  ) {
    Object.assign(this.user, this.router.getCurrentNavigation().extras.state);
    console.log(this.user);
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit() {
    this.changeRecaptchaLanguage();
  }

  createForm() {
    this.form = this.formBuilder.group({
      vCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }
  // public reactiveForm: FormGroup = new FormGroup({
  //   recaptchaReactive: new FormControl(null, Validators.required),
  // });
  //public recaptchaReactive = new FormControl(null, Validators.required);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    if (this.user) {
      const formData: FormData = new FormData();

      const itemBlob = new Blob([JSON.stringify(this.user)], {
        type: 'application/json',
      });
      formData.append('user', itemBlob);
      const activationCode = new Blob([this.form.get('vCode').value], {
        type: 'text/plain',
      });
      formData.append('activationCode', activationCode);

      this.userService.activate(formData).subscribe(
        (res) => {
          console.log(res);
          if (res == false) {
            this.toastr.error(this.translate.instant('verificationCode.error.incorrect'));
          } else {
            this.user.roles = this.user.roles.concat('ROLE_REGISTER_PRIVILEGE');
            this.appStore.dispatch(new fromStore.UpdateAuthUser(this.user));
            this.router.navigate(['signup/partner'], {
              state: this.user,
            });
            this.toastr.success(this.translate.instant('registeration.success'));
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.userService.resendCode(this.user.username).subscribe((res) => {
      this.loading = false;

      console.log(res);
    });
  }
  resendCode() {
    this.loading = false;

    // this.userService.resendCode(this.user.username).subscribe((res) => {
    //   this.loading = false;

    //   console.log(res);
    // });
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
