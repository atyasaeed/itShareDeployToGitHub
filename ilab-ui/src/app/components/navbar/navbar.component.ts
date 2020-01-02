import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
    
  }



  islogin() {
    return this.authenticationService.currentUserValue!=null;
  }

  logout(){
    return this.authenticationService.logout().subscribe()
  }


}
