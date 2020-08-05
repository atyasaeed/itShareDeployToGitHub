import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';

import { AlertService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-signup-activation',
  templateUrl: './signup-activation.component.html',
  styleUrls: ['./signup-activation.component.scss'],
  animations: [routerTransition()],
})
export class SignupActivationComponent implements OnInit {
  form: FormGroup;
  user = {} as User;
  loading = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    Object.assign(this.user, this.router.getCurrentNavigation().extras.state);
    console.log(this.user);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      vCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

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
            this.router.navigate(['signup/updateInfo'], {
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

  resendCode() {
    this.loading = false;

    this.userService.resendCode(this.user.username).subscribe((res) => {
      this.loading = false;

      console.log(res);
    });
  }
}
