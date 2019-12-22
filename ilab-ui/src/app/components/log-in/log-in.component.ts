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

    this._RestService.login(userForm.value.email, userForm.value.password).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['/home', userForm.value.email]);
      },
      err => {
        if (err.status == 400) {
          console.log('InCorrect pass or email');
          this.synError = 'InCorrect pass or email';
         } else {console.log('InCorrect pass or email');
                 this.synError = 'InCorrect pass or email'
                 userForm.reset()
         ; }
      }

    );
  }

}
