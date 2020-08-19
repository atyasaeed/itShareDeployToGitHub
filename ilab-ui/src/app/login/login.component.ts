import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AuthenticationService, AlertService } from '../shared/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/domain';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  user = {} as User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  ngOnInit(): void {}
  onLoggedin() {
    if (this.loginForm.invalid) {
      this.validateAllFormFields(this.loginForm);
      return;
    }
    this.user = this.loginForm.value;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        (data: User) => {
          if (data.roles.includes('ROLE_REGISTER_PRIVILEGE')) {
            this.toastr.info(this.translate.instant('data.activate'));
            this.router.navigate(['signup/partner'], {
              state: this.user,
            });
          } else {
            this.router.navigateByUrl(this.returnUrl || '/home');
            this.toastr.success(this.translate.instant('logIn.success'));
          }
        },
        (err) => {
          console.log(err);
          // this.alertService.error('Sorry Your Username or Password Is Incorrect');
          if (err.error.code == 'org.springframework.security.authentication.DisabledException') {
            // this.router.navigateByUrl('signup/activation');
            // this.user = this.loginForm.value;
            // this.user.roles.concat('ROLE_REGISTER_PRIVILEGE');
            this.router.navigate(['signup/activation'], {
              state: this.loginForm.value,
            });
            this.toastr.warning(this.translate.instant('account.disabled'));
          } else if (err.error.code == 'org.springframework.security.authentication.BadCredentialsException') {
            this.toastr.error(this.translate.instant('badCredential'));
          } else if (err.statusText == 'Unknown Error') {
            this.toastr.error(this.translate.instant('serverDown'));
          }
        }
      );
  }
  f() {
    return this.loginForm;
  }
  hasError(controlName: string) {
    return this.loginForm.get(controlName).touched && this.loginForm.get(controlName).invalid;
  }

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }
}
