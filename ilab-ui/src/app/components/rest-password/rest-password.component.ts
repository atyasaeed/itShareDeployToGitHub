import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rest-password',
  templateUrl: './rest-password.component.html',
  styleUrls: ['./rest-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  // restPasswordForm: any;
  // formBuilder: any;
  // UserService: any;
   alertService: any;
  restPasswordForm: FormGroup;
  constructor(private userService: UserService,  private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.restPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword:  ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.restPasswordForm.invalid) {
      this.validateAllFormFields(this.restPasswordForm);
    } else {
      this.userService.restPassword(this.restPasswordForm.controls.password.value).subscribe(
        res => {this.alertService.success('check your email please')},
          err =>{ console.log(err); }
      );
    }

  }



  validateAllFormFields(formGroup: FormGroup) {         // {1}
  Object.keys(formGroup.controls).forEach(field => {  // {2}
    const control = formGroup.get(field);             // {3}
    if (control instanceof FormControl) {             // {4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        // {5}
      this.validateAllFormFields(control);            // {6}
    }
  });
}
}
