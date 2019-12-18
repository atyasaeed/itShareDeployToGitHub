import { Component, OnInit } from '@angular/core';

export class User {
  public email: string;
  public password: string;
}
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  // tslint:disable-next-line: new-parens
  model = new User;

  constructor() { }

  ngOnInit() {
  }
  onSubmit(form) {
    console.log(JSON.stringify(form.value) );
  }

}
