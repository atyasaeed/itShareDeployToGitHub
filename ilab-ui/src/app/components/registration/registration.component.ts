import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/domain';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private userService:UserService,private alertservice:AlertService) { }

  ngOnInit() {
  }
  model = new User();

  onSubmit(){
    this.userService.register(this.model).subscribe(
      res=>{
     console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
  }

}
