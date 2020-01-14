import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ShoppingCartService } from 'src/app/services';
import { Router } from '@angular/router';
import { ShoppingCartItem } from 'src/app/domain';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn:boolean;
  items: Array<ShoppingCartItem>;
  loading = false;
  // tslint:disable-next-line: max-line-length
  constructor(private authenticationService: AuthenticationService , private router: Router, private shoppingCartService: ShoppingCartService ) { }

 

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user=>{
      this.loggedIn=user?true:false;
    })
this.refresh();
  }



  // islogin() {
  //   return this.authenticationService.currentUserValue != null;
  // }

  logout() {
    return this.authenticationService.logout().subscribe(res=>{this.router.navigateByUrl('/login')});
  }


  private refresh() {
    this.shoppingCartService.query<ShoppingCartItem[]>().subscribe(items => this.items = items);
  }

  deletItem(id) {
    this.loading = true;
    this.shoppingCartService.delete(id).subscribe(resp => {
      this.refresh();
    }, err => {this.loading = false; });
  }



}
