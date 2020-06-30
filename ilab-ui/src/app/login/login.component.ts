import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AuthenticationService, AlertService } from '../shared/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
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
      userName: ['', Validators.required],
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
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigateByUrl(this.returnUrl);
          this.toastr.success(this.translate.instant('logIn.success'));
        },
        (err) => {
          // this.alertService.error('Sorry Your Username or Password Is Incorrect');
          this.alertService.error(this.translate.instant('badCredential'));
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
