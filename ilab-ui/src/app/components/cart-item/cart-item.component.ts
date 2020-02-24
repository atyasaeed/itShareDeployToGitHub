import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
// import { CartDetails } from '../../domain/cart-details.model';
import { NgForm, FormBuilder } from '@angular/forms';
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
  // notes = new FormControl('');
  loading = false;
  item: ShoppingCartItem = new ShoppingCartItem();
  fileToUpload: File = null;
  service: Service ;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute,
              private shoppingCartService: ShoppingCartService,
              private servicesService: ServicesService,
              private router: Router,
              private authenticationService: AuthenticationService,
              @Inject(APP_CONFIG) private appConfig: IAppConfig,
              private formBuilder: FormBuilder) { }

  cartForm: FormGroup ;

  get cartForm$() { return this.cartForm.controls; }
  get file$() { return this.cartForm$.files as FormArray; }
  ngOnInit() {
    this.createForm();
    const serviceId = this.route.snapshot.queryParamMap.get('service');
    this.servicesService.get<Service>(serviceId).subscribe(service => {this.service = service;
      for (let i = 0 ; i < this.service.maxFiles; i++) {
        this.file$.push(this.formBuilder.group({
        file: ['', [Validators.required]],
        material: ['', [Validators.required]],
        type: ['', [Validators.required]],
        colors: ['', [Validators.required]],
        dimensions: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        }));
    }

     });


  }



  createForm() {
    this.cartForm = this.formBuilder.group({
      plannedStartDate: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      attend: ['', [Validators.required]],
      status: ['', [Validators.required]],
      startingDate: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      notes: ['', [Validators.required, Validators.maxLength(250)]],

      files: new FormArray([]),

      // file:['', [Validators.required]],
      // material:['', [Validators.required]],
      // types:['', [Validators.required]],
      // color:['', [Validators.required]],
      // dimensions:['', [Validators.required]],
      // unit:['', [Validators.required]],
    });

  }
  onSubmit() {
    this.loading = true;
    if (this.cartForm.invalid) {
      this.validateAllFormFields(this.cartForm);
      this.loading = false;
    }
    this.item = Object.assign(this.cartForm.value);
    this.item.quantity = 1;
    this.item.quantity = 1;
    this.item.service = this.service;

    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    const itemBlob = new Blob([JSON.stringify(this.item)], {
      type: 'application/json',
    });
    formData.append('item', itemBlob);

    this.shoppingCartService.addCartItem(formData).subscribe(
      resp => {this.router.navigateByUrl('cart'), this.loading = false; },
      err => this.loading = false);

  }

  getImageUrl(): string {
    return this.appConfig.ASSETS_URL + this.service.id;
  }
  handleFileInput(files: FileList) {
    if (files != null) {
      this.fileToUpload = files.item(0);
    }

  }




  validateAllFormFields(formGroup: FormGroup) {         // {1}
  Object.keys(formGroup.controls).forEach(field => {  // {2}
    const control = formGroup.get(field);             // {3}
    if (control instanceof FormControl) {             // {4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        // {5}
      this.validateAllFormFields(control);            // {6}
    }
  });
}

}
