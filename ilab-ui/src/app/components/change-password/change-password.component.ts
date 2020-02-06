import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services';
import { AuthenticationService } from 'src/app/services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';




@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private UserService: UserService,
              private alertService: AlertService,
              private AuthenticationService: AuthenticationService,
              private formBuilder: FormBuilder) { }

  username = this.AuthenticationService.currentUserValue.username;

  // model = {
  //   oldpassword: '',
  //   newpassword: '',
  //   confirmpassword: ''
  // };
  changePasswordForm:FormGroup ;

  ngOnInit() {
    this.createForm() ;
  }
  createForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldpassword:['',[Validators.required]],
      newpassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmpassword:  ['', [Validators.required]],
    }); }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.validateAllFormFields(this.changePasswordForm);
    }else{
      this.UserService.changePassword(this.changePasswordForm.value).subscribe(
        res => {console.log(res); this.alertService.success('your password is changed'); },
        err => {this.alertService.error('sorry your password is incorrect');}
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
