import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../signup/user.service';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  animations: [routerTransition()],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(
    private service: UserService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}
  forgetPasswordForm: FormGroup;

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.invalid) {
      this.validateAllFormFields(this.forgetPasswordForm);
    } else {
      this.service.forgetPassword(this.forgetPasswordForm.controls.Email.value).subscribe(
        (res) => {
          this.alertService.success(this.translate.instant('email.check'));
          // console.log(res);
        },
        (err) => {
          this.alertService.error(this.translate.instant('email.incorrect'));
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
