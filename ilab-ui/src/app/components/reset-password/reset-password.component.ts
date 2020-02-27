import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  // restPasswordForm: any;
  // formBuilder: any;
  // UserService: any;
  //  alertService: any;
  loading = false;
  restPasswordForm: FormGroup;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
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
      this.userService.restPassword(this.restPasswordForm.controls.password.value).subscribe(
        res => {
          this.router.navigateByUrl('/login');
          this.alertService.success('Your Password is Changed');
        },
        err => {
          this.alertService.error('Sorry You Can not Change Password');
          this.loading = false;
        }
      );
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach(field => {
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
