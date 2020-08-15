import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  AfterContentChecked,
  TemplateRef,
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ShoppingCartItem, Service, LineItem, hyperFile, AssetFile } from 'src/app/shared/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from '../../../shared/services/shoppingcart.service';
import { AuthenticationService } from 'src/app/shared/services';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
// import { ServicesService } from './services.service';
import { ServiceService } from 'src/app/shared/services/service.service';

import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { routerTransition } from 'src/app/router.animations';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { delay } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { MySpaceService } from 'src/app/shared/services/my-space.service';

@Component({
  selector: 'app-shopping-cart-form',
  templateUrl: './shopping-cart-form.component.html',
  styleUrls: ['./shopping-cart-form.component.scss'],
  animations: [
    routerTransition(),
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition(':enter', [style({ opacity: 0 }), animate(300)]),
      //transition(':leave', animate(300, style({ opacity: 0 }))),
      transition('in => out', animate(0)),
      transition('out => in', animate(300)),
    ]),
  ],
})
export class ShoppingCartFormComponent implements OnInit, AfterViewInit, AfterContentChecked {
  breadcrumbs = [{ heading: 'Add-Service', icon: 'fa-tasks' }];
  //services;
  private _searchTerm = '';
  loading = false;
  submitted = false;
  msgFileSize: any;
  filename;
  @ViewChild('flyToCart') private flyToCart: ElementRef;
  @ViewChild('myVar') myVar: ElementRef;
  // public selection: string;
  selection = new FormControl(null, Validators.required);
  selectService = new FormControl();
  ext: string[] = [];
  extFile: string;
  filesAsset: AssetFile[] = new Array();
  filterFiles: AssetFile[] = new Array();
  modalRef: BsModalRef;
  serviceId: string;
  objAsset: AssetFile = {} as AssetFile;
  form: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  activeService: Service;
  services: Service[];
  serviceContentAnimation: string;
  constructor(
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private servicesService: ServiceService,
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private formBuilder: FormBuilder,
    private appStore: Store<fromStore.AppState>,
    private cdr: ChangeDetectorRef,
    public spaceService: MySpaceService,
    private modalService: BsModalService,
    private animationService: AnimationService
  ) {
    this.spaceService.searchTerm = '';
    this.spaceService.model$.subscribe((res) => {
      //console.log(res);
      this.filesAsset = res;
    });

    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.objAsset = this.router.getCurrentNavigation().extras.state as AssetFile;
    this.serviceContentAnimation = 'in';
  }

  ngOnInit() {
    this.createForm();
    this.selectService.patchValue(undefined);
    if (this.serviceId && this.objAsset) {
      this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
        this.services = res;
        this.activeService = this.services.find((item) => item.id === this.serviceId);
        //console.log(this.activeService);

        this.buildForm(this.activeService?.id);
      });
    }

    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      this.services = res;
    });

    this.dropdownSettings = {
      singleSelection: false,
      //idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    // this.serviceId = '';
    this.selection.valueChanges.subscribe((res) => {
      this.loading = true;
      //console.log(res);
      if (res == 'option1') {
        this.form.addControl('file', new FormControl('', Validators.required));
        this.form.removeControl('asset_id');
      } else {
        this.form.addControl('asset_id', new FormControl('', Validators.required));
        this.form.get('asset_id').patchValue(undefined);
        this.form.removeControl('file');
      }
    });

    if (this.objAsset) {
      this.selection.patchValue('option2');
      this.loading = true;
      this.form.addControl('asset_id', new FormControl('', Validators.required));
      this.form.get('asset_id').patchValue(this.objAsset.id);
      this.selectService.patchValue(this.activeService.id);
    }
  }
  ngAfterViewInit() {
    //this.flyToCartAnimation();
    this.cdr.detectChanges();
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  createForm() {
    this.form = this.formBuilder.group({
      quantity: ['1', [Validators.required, Validators.min(1), this.numberValidator]],
      notes: [''],
      width: ['', [Validators.required, Validators.min(1), this.numberValidator]],
      height: ['', [Validators.required, Validators.min(1), this.numberValidator]],
    });
  }

  selectValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value == 'undefined') {
      return { required: true };
    }
    return null;
  }
  numberValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value == null) {
      return { NaN: true };
    }
    return null;
  }

  buildForm(id) {
    this.serviceContentAnimation = 'out';
    setTimeout(() => {
      this.serviceContentAnimation = 'in';

      this.selection.patchValue(null);
      this.serviceId = '';
      this.activeService = this.services.find((e) => e.id === id);
      this.filterFiles = [];
      this.form.reset({
        quantity: 1,
        material: 'undefined',
        thickness: 'undefined',
        color: 'undefined',
        type: 'undefined',
        unit: 'undefined',
        processes: 'undefined',
      });
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.form.updateValueAndValidity();

      for (let index = 0; index < this.activeService?.supportedExtensions.length; index++) {
        for (let i = 0; i < this.filesAsset.length; i++) {
          if (
            this.activeService.supportedExtensions[index].split('.').pop() == this.filesAsset[i].name.split('.').pop()
          ) {
            this.filterFiles.push(this.filesAsset[i]);
          }
        }
      }

      //console.log(this.activeService);
      if (this.activeService?.materials != undefined) {
        this.form.addControl('material', new FormControl('undefined', this.selectValidator));
      } else {
        this.form.removeControl('material');
      }
      if (this.activeService?.thickness != undefined) {
        this.form.addControl('thickness', new FormControl('undefined', this.selectValidator));
      } else {
        this.form.removeControl('thickness');
      }
      if (this.activeService?.colors != undefined) {
        this.form.addControl('color', new FormControl('undefined', this.selectValidator));
      } else {
        this.form.removeControl('color');
      }
      if (this.activeService?.types != undefined) {
        this.form.addControl('type', new FormControl('undefined', this.selectValidator));
      } else {
        this.form.removeControl('type');
      }
      if (this.activeService?.units != undefined) {
        this.form.addControl('unit', new FormControl('undefined', this.selectValidator));
      } else {
        this.form.removeControl('unit');
      }
      if (this.activeService?.processes != undefined) {
        if (this.activeService.processes.multi == true) {
          this.form.removeControl('processes');
          this.form.addControl('mprocesses', new FormControl('', Validators.required));
        } else {
          this.form.removeControl('mprocesses');
          this.form.addControl('processes', new FormControl('undefined', this.selectValidator));
        }
      } else {
        if (this.form.get('mprocesses')) {
          this.form.removeControl('mprocesses');
        } else if (this.form.get('processes')) {
          this.form.removeControl('processes');
        }
      }

      this.acceptedExtensions();
    }, 300);
  }

  submit() {
    if (this.form.valid) {
      //console.log(this.form);
      //return;
      const formData: FormData = new FormData();
      let item = {} as LineItem;
      item.service = {} as Service;
      item.files = [] as hyperFile[];
      let hyperFile = {} as hyperFile;
      for (let key in this.form.value) {
        if (key === 'file') {
          formData.append('files', this.filename);
        } else if (key === 'quantity') {
          item.quantity = this.form.value['quantity'];
        } else if (key === 'notes') {
          item.notes = this.form.value['notes'];
        } else if (key === 'selection') {
        } else if (key === 'mprocesses') {
          hyperFile['processes'] = this.form.value[key];
        } else {
          //if (this.form.value[key] != null) {
          hyperFile[key] = this.form.value[key];
        }
      }

      item.files.push(hyperFile);
      item.service.id = this.activeService.id;
      const itemBlob = new Blob([JSON.stringify(item)], {
        type: 'application/json',
      });

      formData.append('item', itemBlob);
      this.form.reset({
        quantity: 1,
        material: 'undefined',
        thickness: 'undefined',
        color: 'undefined',
        type: 'undefined',
        unit: 'undefined',
        processes: 'undefined',
      });
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
      this.shoppingCartService.create(formData).subscribe((res) => {
        this.animationService.flyToCartAnimation(this.flyToCart, 'white');
        setTimeout(() => {
          this.appStore.dispatch(new fromStore.LoadInitState());
          this.router.navigateByUrl('shopping-cart'), (this.loading = false);
        }, 700);
      });
    } else {
      this.form.markAllAsTouched();
      return;
    }
  }

  handleFileInput(fileInput) {
    this.filename = fileInput.target.files[0];

    let fileExtension = this.filename.name.split('.');
    if (this.activeService.supportedExtensions != undefined) {
      let found = false;
      this.activeService.supportedExtensions.forEach((e) => {
        let arr = e.split('.');

        if (arr[1] == fileExtension[fileExtension.length - 1].toLowerCase()) {
          found = true;
        }
      });
      if (found == false) {
        this.form.get('file').setErrors({ extension: this.activeService.supportedExtensions.toString() });
      }
    }
  }

  acceptedExtensions() {
    if (this.activeService?.supportedExtensions != null) {
      this.extFile = '';
      this.ext = [];
      for (let index = 0; index < this.activeService?.supportedExtensions?.length; index++) {
        this.ext.push(this.activeService.supportedExtensions[index].substr(1));
      }
      this.extFile = this.ext.toString();
    }
  }

  set searchTerm(searchTerm: string) {
    this.filterFiles = [];
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.spaceService.searchTerm = `name:'*${searchTerm}*'`;
      this.spaceService.model$.subscribe((res) => {
        this.filterFiles = [];

        for (let index = 0; index < this.activeService?.supportedExtensions.length; index++) {
          for (let i = 0; i < res.length; i++) {
            if (this.activeService.supportedExtensions[index].split('.').pop() == res[i].name.split('.').pop()) {
              this.filterFiles.push(res[i]);
            }
          }
        }
      });
    } else {
      this.spaceService.searchTerm = '';
      this.filterFiles = [];
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }

  fileId(entity) {
    this.form.get('asset_id').patchValue(entity.id);
  }
}
