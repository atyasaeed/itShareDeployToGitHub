import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor( private _router : Router) { }

  ngOnInit() {

   this.isLogIn();
  }

  onLogOut(){
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  isLogIn():boolean{
    if (localStorage.getItem('token') != null) {
      return true
    } else {
      return false
    }
  }

}
