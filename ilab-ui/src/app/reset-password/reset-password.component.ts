import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AlertService } from '../shared/services';
import { Router } from '@angular/router';
import { UserService } from '../signup/user.service';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [routerTransition()],
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  restPasswordForm: FormGroup;
  constructor(
    private service: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.restPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  onSubmit() {
    this.loading = true;
    if (this.restPasswordForm.invalid) {
      this.validateAllFormFields(this.restPasswordForm);
      this.loading = false;
    } else {
      this.service.restPassword(this.restPasswordForm.controls.password.value).subscribe(
        (res) => {
          this.router.navigateByUrl('/login');
          this.alertService.success(this.translate.instant('changePassword.success'));
        },
        (err) => {
          this.alertService.error(this.translate.instant('changePassword.error'));
          this.loading = false;
        }
      );
    }
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
