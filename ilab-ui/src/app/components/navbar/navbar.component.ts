import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService , private CartService: CartService) { }

  index:number;
  ngOnInit() {

  }



  islogin() {
    return this.authenticationService.currentUserValue != null;
  }

  logout() {
    return this.authenticationService.logout().subscribe();
  }



}
