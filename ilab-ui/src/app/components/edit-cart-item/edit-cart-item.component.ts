import { Component, OnInit } from '@angular/core';
import { CartDetails } from 'src/app/domain/cart-details.model';
import { Service } from 'src/app/domain/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-cart-item.component.html',
  styleUrls: ['./edit-cart-item.component.css']
})
export class EditCartItemComponent implements OnInit {

  serviceDetails = new CartDetails();

  constructor(private route: ActivatedRoute, private CartService: CartService, private router: Router) { }

  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('id');
   this.CartService.getServiceDetailsById(id).subscribe(res => {console.log(res); });
  }

  onSubmit() {

  }

}
