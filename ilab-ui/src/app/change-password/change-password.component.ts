import { AuthenticationService } from '../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../signup/user.service';
import { routerTransition } from '../router.animations';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [routerTransition()],
})
export class ChangePasswordComponent implements OnInit {
  username: string;
  constructor(
    private service: UserService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private toastr: ToastrService
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
    if (this.changePasswordForm.invalid) {
      this.validateAllFormFields(this.changePasswordForm);
    } else {
      this.service.changePassword(this.changePasswordForm.value).subscribe(
        (res) => {
          this.router.navigateByUrl('/');
          this.alertService.success(this.translate.instant('changePassword.success'));
        },
        (err) => {
          this.alertService.error(this.translate.instant('password.incorrect'));
        }
      );
    }
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
