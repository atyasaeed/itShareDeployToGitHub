import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginData } from './login.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 // model: LoginData;
  model={
  userName:"",
  password:"",
  isLoggedin: false,
}

  
  constructor(private router:Router) { }

  ngOnInit() {
    
  }

  onSubmit(userForm:NgForm){
    const userName = "mody";
    const password = "123456"
    if (userForm.value.userName ==userName && userForm.value.password == password) {
      this.router.navigate(['/order']);
      this.model.isLoggedin = true;
      localStorage.setItem('token','body');
    }
    
  }

}
