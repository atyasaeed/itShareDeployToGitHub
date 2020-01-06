// import { CartDetails } from '../../domain/cart-details.model';
import { NgForm } from '@angular/forms';
import { Service } from '../../domain/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ServicesService } from 'src/app/services';
import { ShoppingCartItem } from 'src/app/domain/shoppingcart-item.model';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';


@Component({
  selector: 'app-service',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})

export class CartItemComponent implements OnInit {

  item:ShoppingCartItem=new ShoppingCartItem();
  service ;
  constructor(private route: ActivatedRoute, private shoppingCartService: ShoppingCartService,private servicesService:ServicesService, private router:Router) { }

  ngOnInit() {

    const serviceId = this.route.snapshot.queryParamMap.get('service');
    this.servicesService.get<Service>(serviceId).subscribe(service => this.service=service );
  }
  onSubmit() {
    this.item.service = this.service;
    this.shoppingCartService.create(this.item).subscribe(
      res=>{this.router.navigateByUrl('/cart')}
    )

  }


}
