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
  submitted = false;
  ext:string[]=[];
  extFile:string;
  filename:string ;
  item: ShoppingCartItem = new ShoppingCartItem();
  // fileToUpload: File = null;
  public totalfiles: Array<File> =[];
  public totalFileName = [];
  public lengthCheckToaddMore =0;
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
        material: [this.service.materials[0].name, [Validators.required]],
        type: [this.service.materials[0].types[0].name, [Validators.required]],
        color: [this.service.materials[0].types[0].colors[0], [Validators.required]],
        dimension: [this.service.materials[0].types[0].dimensions[0], [Validators.required]],
        unit: ['cm', [Validators.required]],
        status: ['', [Validators.required]],
        }))
      }
      for (let index = 0; index < this.service.supportedExtensions.length; index++) {
          this.ext.push(this.service.supportedExtensions[index].substr(1))
      }
     this.extFile = this.ext.toString() ;
     });


  }



  createForm() {
    this.cartForm = this.formBuilder.group({
      quantity: ['', [Validators.required]],
      attend: ['', [Validators.required]],
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
    console.log(this.cartForm.value)
    this.loading = true;
    this.submitted = true;
    if (this.cartForm.invalid) {
      this.validateAllFormFields(this.cartForm);
      this.loading = false;
    }

    
    this.item = Object.assign(this.cartForm.value);
    this.item.service = this.service;
    for (let index = 0; index <this.file$.length ; index++) {
      this.item.files.push(this.file$[index])
    }
    console.log(this.item)

    const formData: FormData = new FormData();
    for(let j=0;j<this.totalfiles.length; j++)
    {
      console.log("the values is ",<File>this.totalfiles[j]);
      console.log("the name is ",this.totalFileName[j]);

      //  formData.append(this.totalFileName[j]+(j+1),<File>this.totalfiles[j])
      


    }
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

   handleFileInput(fileInput: any,oldIndex) {

    console.log("oldIndex is ", oldIndex);
     this.filename= fileInput.target.files[0].name
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
      }
      if(oldIndex==0)
    {
      this.totalfiles.unshift((fileInput.target.files[0]))
      this.totalFileName.unshift(fileInput.target.files[0].name)
    }
    else
    {
      this.totalfiles[oldIndex]=(fileInput.target.files[0]);
      this.totalFileName[oldIndex]=fileInput.target.files[0].name

    }

      reader.readAsDataURL(fileInput.target.files[0]);
    }

    if(this.totalfiles.length == 1)
    {
      this.lengthCheckToaddMore=1;
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
