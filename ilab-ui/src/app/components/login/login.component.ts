import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginData } from './login.model';
import { NgForm } from '@angular/forms';
import { RestServiceService } from 'src/app/services/rest-service.service';
import { AuthenticationService, AlertService } from 'src/app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
 // model: LoginData;
  model={
  username:"",
  password:"",
  isLoggedin: false,
}

  
  constructor(private router:Router, private route: ActivatedRoute,private authenticationService:AuthenticationService,private alertService: AlertService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
  }

  onSubmit(){
    this.authenticationService.login(this.model.username,this.model.password)
      .pipe(first()).subscribe(data => {
      this.router.navigate([this.returnUrl]);
    },
    error => {
      this.alertService.error(error);
      // this.loading = false;
    })

    // if ( this.restservice.login(this.model.userName,this.model.password) ) {
    //   this.router.navigate(['/order']);
    //   this.model.isLoggedin = true;
    //   localStorage.setItem('token','body');
    // }
    
  }

}
