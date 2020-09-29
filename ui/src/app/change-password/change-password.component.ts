import { AuthenticationService } from '../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { routerTransition } from '../router.animations';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/services/user.service';
import { TdLoadingService } from '@covalent/core/loading';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [routerTransition()],
})
export class ChangePasswordComponent implements OnInit {
  username: string;
  fieldTextTypePass: boolean;
  fieldTextTypeConfPass: boolean;
  fieldTextTypeOldPass: boolean;
  constructor(
    private service: UserService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private toastr: ToastrService,
    protected loadingService: TdLoadingService
  ) {
    appStore.select(fromStore.getAuthUser).subscribe((user) => (this.username = user.username));
  }

  changePasswordForm: FormGroup;

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmpassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.loadingService.register('loading');
    if (this.changePasswordForm.invalid) {
      this.loadingService.resolve('loading');
      this.validateAllFormFields(this.changePasswordForm);
    } else {
      this.service.changePassword(this.changePasswordForm.value).subscribe(
        (res) => {
          this.loadingService.resolve('loading');
          this.router.navigateByUrl('/');
          this.alertService.success(this.translate.instant('changePassword.success'));
        },
        (err) => {
          this.loadingService.resolve('loading');

          this.alertService.error(this.translate.instant('password.incorrect'));
        }
      );
    }
  }
  toggleFieldTextTypePass() {
    this.fieldTextTypePass = !this.fieldTextTypePass;
  }
  toggleFieldTextTypeConfPass() {
    this.fieldTextTypeConfPass = !this.fieldTextTypeConfPass;
  }
  toggleFieldTextTypeOldPass() {
    this.fieldTextTypeOldPass = !this.fieldTextTypeOldPass;
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
