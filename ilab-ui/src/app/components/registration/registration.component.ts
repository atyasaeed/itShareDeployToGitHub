import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/domain';
import { AlertService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private userService:UserService,private alertservice:AlertService,private router:Router) { }
  loading = false;

  ngOnInit() {
  }
  model = new User();

  onSubmit(){
    this.loading = true;
    this.userService.register(this.model).subscribe(
      res=>{
        this.router.navigateByUrl('/login')
      },
      err=>{
        this.loading = false;
        console.log(err)
      }
    )
  }

}
