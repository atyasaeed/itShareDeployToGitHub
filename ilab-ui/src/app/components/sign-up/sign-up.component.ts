import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from 'src/app/services/registration.service';

export class User {
  public username: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public firstname: string;
  public middlename: string;
  public lastname: string;

}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor( private _formBuilder: FormBuilder , private _registrationService : RegistrationService) { }
  model = new User();

mytest :any;
  ngOnInit() {
    this._registrationService.GetUser().subscribe(
      response => { console.log(JSON.stringify(response)) },
      error => {});
  }
  onSubmit(form) {
    console.log(JSON.stringify(form.value) );

    this._registrationService.AddUser().subscribe();

  }



}


