import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  formModel = {
    email: '',
    password: ''
  };
  synError: string;

  constructor( private _RestService: RestService ,
               private _router: Router,
               ) { }

  // tslint:disable-next-line: new-parens
   ngOnInit() {

    if (localStorage.getItem('token') != null) {
      this._router.navigate(['/home', this.formModel.email]);
    }
  }

  onFormSubmit() {

  }
  onSubmit(userForm: NgForm) {
    const email = userForm.value.email;
    const password = userForm.value.password;
    this._RestService.getauth(email ,password);
      }


  }


