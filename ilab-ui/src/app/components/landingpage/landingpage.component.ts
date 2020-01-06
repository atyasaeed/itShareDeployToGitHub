import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/domain/service.model';
import {CartService} from '../../services/cart.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  services: Service [];
  constructor(private CartService: CartService ) { }

  ngOnInit() {
   this.getAllService();
  }

  getAllService() {

    this.CartService.getAllService().subscribe(
      res => {this.services = res; }
    );

  }

}
