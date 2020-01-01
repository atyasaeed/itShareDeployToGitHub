import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService, AlertService } from 'src/app/services';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private UserService:UserService,private alertService: AlertService) { }

  model ={
    email:''
  }

  ngOnInit() {
  }

  onSubmit(){
    this.UserService.forgetPassword(this.model.email).subscribe(
      res=>{this.alertService.success("check your email please")
        console.log(res)}
    )
  }

}
