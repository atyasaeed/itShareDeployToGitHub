import { CartDetails } from '../../domain/cart-details.model';
import { NgForm } from '@angular/forms';
import { Service } from '../../domain/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-service',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})

export class CartItemComponent implements OnInit {

  CartItem = new CartDetails();
  service = new Service();
  constructor(private route: ActivatedRoute, private CartService: CartService,private router:Router) { }



  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    this.CartService.getServiceById(id).subscribe(res => { console.log(res); this.service = res; });
  }
  onSubmit() {
    this.CartItem.service = this.service;
    this.CartService.addCartItem(this.CartItem).subscribe(
      res=>{this.router.navigateByUrl('/cart')}
    )

  }


}
