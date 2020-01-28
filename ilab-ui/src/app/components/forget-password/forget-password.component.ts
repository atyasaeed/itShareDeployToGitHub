import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService, AlertService } from 'src/app/services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private UserService: UserService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) { }

  // model = {
  //   email: ''
  // };
  forgetPasswordForm:FormGroup ;

  ngOnInit() {
    this.createForm() ;
  }
  createForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      Email: ['', [Validators.required,Validators.email]],})
  }

  onSubmit() {
    if (this.forgetPasswordForm.invalid) {
      this.validateAllFormFields(this.forgetPasswordForm);
    } else {
      this.UserService.forgetPassword(this.forgetPasswordForm.controls.Email.value).subscribe(
        res => {this.alertService.success('check your email please');
              console.log(res);},
          err => {this.alertService.error('this email incorrect');}
      );
    }

  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
  Object.keys(formGroup.controls).forEach(field => {  //{2}
    const control = formGroup.get(field);             //{3}
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        //{5}
      this.validateAllFormFields(control);            //{6}
    }
  });
}

}
