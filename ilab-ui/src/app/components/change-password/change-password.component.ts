import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services';
import { AuthenticationService } from 'src/app/services';




@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private UserService:UserService,private alertService: AlertService,private AuthenticationService:AuthenticationService) { }

  username = this.AuthenticationService.currentUserValue.username;

  model={
    oldpassword:'',
    newpassword:'',
    confirmpassword:''
  }

  ngOnInit() {
  }

  onSubmit(){
    this.UserService.changePassword(this.model).subscribe(
      res=>{console.log(res); this.alertService.success("your password is changed"); },
      err=>{this.alertService.error("sorry your password is incorrect")}
    )

  }

}
