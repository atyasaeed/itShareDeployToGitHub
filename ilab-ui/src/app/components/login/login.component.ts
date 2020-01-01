import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginData } from './login.model';
import { NgForm } from '@angular/forms';
import { RestServiceService } from 'src/app/services/rest-service.service';

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

  
  constructor(private router:Router, private restservice:RestServiceService) { }

  ngOnInit() {
    
  }

  onSubmit(userForm:NgForm){

    if ( this.restservice.login(userForm.value.userName,userForm.value.password) ) {
      this.router.navigate(['/order']);
      this.model.isLoggedin = true;
      localStorage.setItem('token','body');
    }
    
  }

}
