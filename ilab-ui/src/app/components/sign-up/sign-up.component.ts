import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { NgForm } from '@angular/forms';

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

  constructor( private _rest: RestService) { }
  model = new User();

  ngOnInit() {
  }
  onSubmit(formModel: NgForm) {

    console.log(formModel.value);

    this._rest.register(formModel.value).subscribe(
      (res: any) => {
        if (res.succeded) {
          formModel.reset();

        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                break;
              default:
                break;
            }
          });
        }
      }
    );
  }



}


