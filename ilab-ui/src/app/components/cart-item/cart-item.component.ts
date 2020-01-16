// import { CartDetails } from '../../domain/cart-details.model';
import { NgForm } from '@angular/forms';
import { Service } from '../../domain/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { ServicesService, AuthenticationService } from 'src/app/services';
import { ShoppingCartItem } from 'src/app/domain/shoppingcart-item.model';
import { ShoppingCartService } from 'src/app/services/shoppingcart.service';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-service',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})

export class CartItemComponent implements OnInit {
  loading = false;
  item: ShoppingCartItem = new ShoppingCartItem();
  fileToUpload: File = null;
  service:Service ;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private servicesService: ServicesService,
    private router:Router,
    private authenticationService: AuthenticationService,
    @Inject(APP_CONFIG) private appConfig:IAppConfig) { }


  ngOnInit() {

    const serviceId = this.route.snapshot.queryParamMap.get('service');
    this.servicesService.get<Service>(serviceId).subscribe(service => this.service = service );
  }
  onSubmit() {
    this.loading = true;
    this.item.service = this.service;
    const formData:FormData=new FormData();
    formData.append("file",this.fileToUpload,this.fileToUpload.name);
    const itemBlob = new Blob([JSON.stringify(this.item)], {
      type: 'application/json', 
    });
    formData.append("item",itemBlob);
    
    this.shoppingCartService.addCartItem(formData).subscribe(
      resp=>this.router.navigateByUrl("cart"),
      err=>this.loading=false);

  }

  getImageUrl():string{
    return this.appConfig.ASSETS_URL+this.service.id;
  }
  handleFileInput(files:FileList){
    if(files!=null)
      this.fileToUpload=files.item(0);

  }

}
