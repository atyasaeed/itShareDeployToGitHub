import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 public isUserLoggedIn: boolean = false;

  constructor( private _router : Router , private _restservice: RestService) { }

  ngOnInit() {
  }

  onLogOut(){
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  isLogIn(){
    if (localStorage.getItem('token') != null) {
      return true
    } else {
      return false
            }
  }

}
