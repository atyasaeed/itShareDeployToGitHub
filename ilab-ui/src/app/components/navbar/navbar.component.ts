import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }



  islogin() {
    if (localStorage.getItem('token') != null) {
      // console.log(localStorage.getItem('token'))
      return true;
    } else {
      return false;
    }
  }

  islogout(){
    localStorage.removeItem('token')
  }


}
