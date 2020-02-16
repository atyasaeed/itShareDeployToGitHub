import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/domain';
import { AlertService } from 'src/app/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private userService: UserService,
              private alertservice: AlertService,
              private router: Router,
              private formBuilder: FormBuilder) { }
  loading = false;
  // model = new User();

  registrationForm: FormGroup;

  ngOnInit() {
    this.createForm() ;
  }
  createForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword:  ['', [Validators.required]],

    }); }

  onSubmit() {
   // this.loading = true;
    if (this.registrationForm.invalid) {
      this.validateAllFormFields(this.registrationForm);
    } else {
      this.userService.register(this.registrationForm.value).subscribe(
        res => {
          this.router.navigateByUrl('/login');
          this.alertservice.success('please Login');
        },
        err => {
          this.loading = false;
          console.log(err);
        }
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
