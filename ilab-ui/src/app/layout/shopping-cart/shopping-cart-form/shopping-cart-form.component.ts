import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { ShoppingCartItem, Service } from 'src/app/shared/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from '../shoppingcart.service';
import { AuthenticationService } from 'src/app/shared/services';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ServicesService } from './services.service';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-shopping-cart-form',
  templateUrl: './shopping-cart-form.component.html',
  styleUrls: ['./shopping-cart-form.component.scss'],
  animations: [routerTransition()],
})
export class ShoppingCartFormComponent implements OnInit, AfterViewInit {
  breadcrumbs = [{ heading: 'Add-Service', icon: 'fa-tasks' }];
  //services;
  loading = false;
  submitted = false;
  msgFileSize: any;
  filename;
  //ext: string[] = [];
  //extFile: string;
  //filename: string;
  // item: ShoppingCartItem = new ShoppingCartItem();
  //item: ShoppingCartItem;
  // fileToUpload: File = null;
  //public totalfiles: Array<File> = [];
  //public totalFileName = [];
  //public lengthCheckToaddMore = 0;
  //service: Service;
  form: FormGroup;
  //dropdownList = [];
  //selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  activeService: any = {};
  test = {
    services: [
      {
        id: '1',
        name: '3D Printing',
        image: 'assets/images/3d.jpg',
        description: '3D Printing Mono Color',
        maxFiles: 1,
        process: {
          multi: true,
          values: ['Cut', 'Engrave'],
        },
        materials: ['Mat3', 'Mat4'],
        //thickness: ['1.0mm', '2.0mm'],
        supportedExtensions: ['*.stl', '*.jpg'],
        type: ['type1', 'type2'],
        color: ['color1', 'color2'],
        unit: ['das', 'sda'],
      },
      {
        id: '2',
        name: 'Laser Cutting',
        image: 'assets/images/laser.jpg',
        description: 'Laser Cutting',
        maxFiles: 1,
        process: {
          multi: false,
          values: ['SLA', 'FDA'],
        },
        materials: ['Mat1', 'Mat2'],
        thickness: ['6.0mm', '5.0mm'],
        supportedExtensions: ['*.stl', '*.pdf'],
      },
    ],
  };
  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private servicesService: ServicesService,
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private formBuilder: FormBuilder,
    private appStore: Store<fromStore.AppState>
  ) {}

  // get cartForm$() {
  //   return this.cartForm.controls;
  // }
  // get file$() {
  //   return this.cartForm$.files as FormArray;
  // }
  ngOnInit() {
    this.createForm();
    // this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
    //   // this.services = new Array(res);
    //   this.services = Object.assign(res);
    //   this.service = this.services[0];
    //   //this.bulidForm(this.service);
    // });

    this.dropdownSettings = {
      singleSelection: false,
      //idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  ngAfterViewInit() {}

  createForm() {
    this.form = this.formBuilder.group({
      quantity: ['1', [Validators.required, Validators.min(1), this.numberValidator]],
      // attend: [''],
      // startingDate: [''],
      // deliveryDate: [''],
      notes: [''],
      file: ['', Validators.required],
      // files: new FormArray([]),
      materials: ['undefined', [Validators.required]],
      width: ['', [Validators.required, this.numberValidator]],
      height: ['', [Validators.required, this.numberValidator]],
    });
  }

  // extensionValidator(control: AbstractControl, arr): { [key: string]: any } | null {
  //   //console.log(control.value);

  //   return null;
  // }

  numberValidator(control: AbstractControl): { [key: string]: any } | null {
    //console.log(control.value);
    //const value: string = control.value || '';
    if (control.value == null) {
      return { NaN: true };
    }
    return null;
  }
  // onItemSelect(item: any) {
  //   console.log(item);
  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }

  // onSubmit() {
  //   this.loading = true;
  //   this.submitted = true;
  //   //console.log(this.cartForm.value);
  //   if (this.cartForm.invalid) {
  //     this.validateAllFormFields(this.cartForm);
  //     this.loading = false;
  //     return;
  //   }
  //   this.item = Object.assign(this.cartForm.value);
  //   this.item.service = {} as Service;
  //   this.item.service.id = this.service.id;
  //   for (let index = 0; index < this.file$.length; index++) {
  //     // this.item.files.push(this.file$[index]);
  //     this.item.files;
  //   }

  //   const formData: FormData = new FormData();
  //   for (let j = 0; j < this.totalfiles.length; j++) {
  //     // formData.append(this.totalFileName[j] + (j + 1), <File>this.totalfiles[j]);
  //     formData.append('files', this.totalfiles[j] as File);
  //   }
  //   // formData.append('file', this.fileToUpload, this.fileToUpload.name);
  //   const itemBlob = new Blob([JSON.stringify(this.item)], {
  //     type: 'application/json',
  //   });

  //   formData.append('item', itemBlob);

  //   //console.log(this.file$.value);
  //   for (let index = 0; index < this.file$.value.length; index++) {
  //     //console.log(this.file$.value[index].file);
  //   }
  //   this.shoppingCartService.create(formData).subscribe(
  //     (resp) => {
  //       this.appStore.dispatch(new fromStore.LoadInitState());
  //       this.router.navigateByUrl('shopping-cart'), (this.loading = false);
  //     },
  //     (err) => (this.loading = false)
  //   );
  // }

  // getImageUrl(): string {
  //   return this.appConfig.ASSETS_URL + this.service.id;
  // }

  // handleFileInput(fileInput: any, oldIndex) {
  //   //  this.filename= fileInput.target.files[0].name;
  //   this.msgFileSize = fileInput.target.files[0].size;
  //   if (this.msgFileSize > this.appConfig.FILE_SIZE) {
  //     return;
  //   }

  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     let reader = new FileReader();
  //     reader.onload = (event: any) => {};
  //     if (oldIndex == 0) {
  //       this.totalfiles.unshift(fileInput.target.files[0]);
  //       this.totalFileName.unshift(fileInput.target.files[0].name);
  //     } else {
  //       this.totalfiles[oldIndex] = fileInput.target.files[0];
  //       this.totalFileName[oldIndex] = fileInput.target.files[0].name;
  //     }

  //     reader.readAsDataURL(fileInput.target.files[0]);
  //   }

  //   if (this.totalfiles.length == 1) {
  //     this.lengthCheckToaddMore = 1;
  //   }
  // }

  // onChangeObj(event) {
  //   //console.log(event);
  // }
  buildForm(event) {
    //console.log(event.target.value);
    this.form.reset({
      quantity: 1,
      materials: 'undefined',
    });
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.activeService = this.test.services.find((e) => e.id === event.target.value);
    //   this.file$.clear();
    //console.log(this.activeService);
    if (this.activeService.thickness != undefined) {
      this.form.addControl('thickness', new FormControl('undefined', Validators.required));
    } else {
      this.form.removeControl('thickness');
    }
    if (this.activeService.color != undefined) {
      this.form.addControl('color', new FormControl('undefined', Validators.required));
    } else {
      this.form.removeControl('color');
    }
    if (this.activeService.type != undefined) {
      this.form.addControl('type', new FormControl('undefined', Validators.required));
    } else {
      this.form.removeControl('type');
    }
    if (this.activeService.process != undefined) {
      this.form.addControl('process', new FormControl('', Validators.required));
    } else {
      this.form.removeControl('process');
    }

    //   this.service = event;
    //   for (let i = 0; i < this.service.maxFiles; i++) {
    //     this.file$.push(
    //       this.formBuilder.group({
    //         file: ['', [Validators.required]],
    //         material: [this.service?.materials[0]?.name, [Validators.required]],
    //         type: [this.service?.materials[0]?.types[0]?.name, [Validators.required]],
    //         color: [this.service.materials[0].types[0].colors[0], [Validators.required]],
    //         dimension: [this.service.materials[0].types[0].dimensions[0], [Validators.required]],
    //         unit: [this.service.units[0], [Validators.required]],
    //       })
    //     );
    //   }
    //   for (let index = 0; index < this.service?.supportedExtensions?.length; index++) {
    //     this.ext.push(this.service.supportedExtensions[index].substr(1));
    //   }
    //   this.extFile = this.ext.toString();
  }

  submit() {
    console.log(this.form);
    console.log(this.filename);
  }

  handleFileInput(fileInput: any) {
    this.filename = fileInput.target.files[0];

    let fileExtension = this.filename.name.split('.');
    if (this.activeService.supportedExtensions != undefined) {
      let found = false;
      this.activeService.supportedExtensions.forEach((e) => {
        e = e.split('.');
        if (e[1] == fileExtension[fileExtension.length - 1].toLowerCase()) {
          found = true;
        }
      });
      if (found == false) {
        this.form.get('file').setErrors({ extension: this.activeService.supportedExtensions.toString() });
      }
    }
  }

  // validateAllFormFields(formGroup: FormGroup) {
  //   // {1}
  //   Object.keys(formGroup.controls).forEach((field) => {
  //     // {2}
  //     const control = formGroup.get(field); // {3}
  //     if (control instanceof FormControl) {
  //       // {4}
  //       control.markAsTouched({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       // {5}
  //       this.validateAllFormFields(control); // {6}
  //     }
  //   });
  // }
}
